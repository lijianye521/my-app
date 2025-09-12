import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Card, Button, Tag, Typography, Space, Table, Checkbox, Modal, Input, 
  Upload, Spin, Alert, Popconfirm, Form, message, theme, Divider
} from "antd";
import {
  UserOutlined, UserAddOutlined, ExclamationCircleOutlined, CheckCircleOutlined, 
  KeyOutlined, DeleteOutlined, WarningOutlined, UploadOutlined, SafetyOutlined,
  ReloadOutlined, HomeOutlined
} from "@ant-design/icons";
import { UserItem } from "./types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import RegisterForm from "@/components/RegisterForm";

export default function UsersManagement() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();
  
  // 多选相关状态
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  // 修改密码相关状态
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  
  // Excel导入相关状态
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);
  const [isImportResultsOpen, setIsImportResultsOpen] = useState(false);
  
  // 批量角色设置相关状态
  const [isBatchRoleLoading, setBatchRoleLoading] = useState(false);
  
  // 添加用户弹窗状态
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // 使用ref来跟踪是否已经发送请求，避免重复请求
  const hasInitialFetchedRef = useRef(false);
  
  // 直接从session中获取管理员状态
  const isAdmin = session?.user?.role === "admin";

  const { token } = theme.useToken();
  const { Title, Text } = Typography;

  // 获取用户列表数据 - 使用useCallback缓存函数
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log("正在获取用户列表...");
      const response = await fetch("/api/users");
      
      if (!response.ok) {
        if (response.status === 403) {
          message.error("获取用户数据失败：没有访问权限");
          return;
        }
        
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setUsers(result.data);
        console.log("用户列表获取成功:", result.data.length);
      } else {
        message.error(result.error || "获取用户列表失败");
      }
    } catch (error) {
      console.error("获取用户列表发生错误:", error);
      message.error("获取用户数据时发生错误，请稍后再试");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 只有管理员才获取用户列表，并且只获取一次
  useEffect(() => {
    // 如果已经获取过数据且不是刷新页面，直接返回
    if (hasInitialFetchedRef.current) return;
    
    if (session && isAdmin) {
      hasInitialFetchedRef.current = true; // 标记为已获取
      fetchUsers();
    } else if (session) {
      // 非管理员直接设置为非加载状态
      setIsLoading(false); 
    }
  }, [session, isAdmin, fetchUsers]);

  // 获取角色标签
  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return <Tag color="red">管理员</Tag>;
    }
    return <Tag color="default">普通用户</Tag>;
  };

  // 获取状态标签
  const getStatusBadge = (status: number) => {
    if (status === 1) {
      return <Tag color="green">激活</Tag>;
    }
    return <Tag color="red">禁用</Tag>;
  };
  
  // 打开修改密码对话框
  const openPasswordDialog = (user: UserItem) => {
    // 检查是否有多个用户被选中
    if (selectedUserIds.length > 1) {
      message.error("修改密码时只能选择一个用户，请取消多选后重试");
      return;
    }
    
    setSelectedUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setIsPasswordDialogOpen(true);
  };
  
  // 处理复选框变更
  const handleCheckboxChange = (userId: string) => {
    setSelectedUserIds(prev => {
      if (prev.includes(userId)) {
        // 如果已经选中，则取消选中
        const newSelected = prev.filter(id => id !== userId);
        setSelectAll(false);
        return newSelected;
      } else {
        // 否则添加到选中列表
        const newSelected = [...prev, userId];
        // 如果全部选中，则将selectAll设为true
        if (newSelected.length === users.length) {
          setSelectAll(true);
        }
        return newSelected;
      }
    });
  };

  // 处理全选/取消全选
  const handleSelectAll = () => {
    if (selectAll) {
      // 如果当前是全选状态，则取消全选
      setSelectedUserIds([]);
      setSelectAll(false);
    } else {
      // 否则全选
      setSelectedUserIds(users.map(user => user.id));
      setSelectAll(true);
    }
  };

  // 批量删除选中的用户
  const handleBatchDelete = async () => {
    if (selectedUserIds.length === 0) {
      message.error("请先选择要删除的用户");
      return;
    }

    try {
      // 创建一个结果跟踪对象
      const results = {
        total: selectedUserIds.length,
        success: 0,
        failed: 0,
        errors: [] as string[]
      };
      
      // 逐个删除用户，而不是使用Promise.all
      // 这样即使某些请求失败，其他请求仍然可以继续
      for (const userId of selectedUserIds) {
        try {
          const response = await fetch(`/api/users/${userId}`, {
            method: "DELETE"
          });
          
          // 检查响应状态
          if (!response.ok) {
            const errorText = await response.text();
            let errorMessage;
            try {
              // 尝试解析为JSON
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.error || `删除失败(${response.status})`;
            } catch {
              // 如果无法解析为JSON，使用状态码
              errorMessage = `删除失败(${response.status})`;
            }
            
            console.error(`删除用户 ${userId} 失败:`, errorMessage);
            results.failed++;
            results.errors.push(`ID:${userId} - ${errorMessage}`);
            continue;
          }
          
          const data = await response.json();
          if (data.success) {
            results.success++;
          } else {
            results.failed++;
            results.errors.push(`ID:${userId} - ${data.error || '未知错误'}`);
          }
        } catch (err) {
          console.error(`删除用户 ${userId} 时出错:`, err);
          results.failed++;
          results.errors.push(`ID:${userId} - 请求处理错误`);
        }
      }

      // 展示结果
      if (results.success > 0) {
        message.success(`成功删除 ${results.success} 个用户`);
        
        // 从用户列表中移除已删除的用户
        const successIds = selectedUserIds.filter((_, index) => index < results.success);
        setUsers(prev => prev.filter(user => !successIds.includes(user.id)));
        
        // 清空选中状态
        setSelectedUserIds([]);
        setSelectAll(false);
      }
      
      // 如果有失败的，显示错误
      if (results.failed > 0) {
        console.error("删除失败详情:", results.errors);
        message.error(`${results.failed} 个用户删除失败，请查看控制台了解详情`);
      }
    } catch (error) {
      console.error("批量删除用户失败:", error);
      message.error("删除用户时发生错误");
    } finally {
      setIsDeleteConfirmOpen(false);
    }
  };
  
  // 处理Excel文件导入
  const handleExcelImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // 验证文件类型
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
      message.error("只支持Excel文件格式(.xlsx或.xls)");
      return;
    }
    
    try {
      setIsImporting(true);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/users/import-excel', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '导入失败');
      }
      
      if (result.success) {
        setImportResults(result.results);
        setIsImportResultsOpen(true);
        message.success(result.message);
        
        // 刷新用户列表
        hasInitialFetchedRef.current = false;
        await fetchUsers();
      } else {
        message.error(result.error || '导入失败');
      }
    } catch (error: any) {
      console.error('Excel导入失败:', error);
      message.error(error.message || 'Excel导入过程中发生错误');
    } finally {
      setIsImporting(false);
      // 清空文件选择
      event.target.value = '';
    }
  };
  
  // 批量设置用户角色
  const handleBatchSetRole = async (role: 'admin' | 'user') => {
    if (selectedUserIds.length === 0) {
      message.error('请先选择要修改的用户');
      return;
    }
    
    try {
      setBatchRoleLoading(true);
      
      const response = await fetch('/api/users/batch-role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userIds: selectedUserIds,
          role: role
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '设置角色失败');
      }
      
      if (result.success) {
        message.success(result.message);
        
        // 更新本地用户列表中的角色
        setUsers(prev => prev.map(user => {
          if (selectedUserIds.includes(user.id)) {
            return { ...user, role: role };
          }
          return user;
        }));
        
        // 清空选中状态
        setSelectedUserIds([]);
        setSelectAll(false);
      } else {
        message.error(result.error || '设置角色失败');
      }
    } catch (error: any) {
      console.error('批量设置角色失败:', error);
      message.error(error.message || '设置角色过程中发生错误');
    } finally {
      setBatchRoleLoading(false);
    }
  };
  
  // 处理密码修改提交
  const handlePasswordChange = async () => {
    if (!selectedUser) return;
    
    if (!newPassword || !confirmPassword) {
      message.error("请输入密码");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      message.error("两次输入的密码不一致");
      return;
    }
    
    try {
      setIsPasswordLoading(true);
      
      const response = await fetch(`/api/users/${selectedUser.id}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "修改密码失败");
      }
      
      message.success(`已成功修改用户 ${selectedUser.username} 的密码`);
      setIsPasswordDialogOpen(false);
    } catch (error: any) {
      message.error(error.message || "修改密码时出错");
    } finally {
      setIsPasswordLoading(false);
    }
  };
  
  // 不再需要单独的注册成功处理函数

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '50vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message="访问受限"
          description="只有管理员才能访问此页面。"
          type="warning"
          showIcon
          icon={<ExclamationCircleOutlined />}
          action={
            <Button 
              onClick={() => router.push("/pages/dashboard")}
              icon={<HomeOutlined />}
            >
              返回仪表板
            </Button>
          }
          style={{ marginBottom: 24 }}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space size="middle">
          <Title level={2} style={{ margin: 0 }}>用户管理</Title>
          <Tag color="blue">{users.length}个用户</Tag>
          {selectedUserIds.length > 0 && (
            <Tag color="red">{selectedUserIds.length}个用户已选中</Tag>
          )}
        </Space>
        <Space wrap>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => {
              // 手动刷新时重置状态，允许获取数据
              hasInitialFetchedRef.current = false;
              fetchUsers();
            }}
          >
            刷新数据
          </Button>
          
          {/* Excel导入按钮 */}
          <Upload
            accept=".xlsx,.xls"
            beforeUpload={(file) => {
              const event = { target: { files: [file], value: '' } } as any;
              handleExcelImport(event);
              return false; // 防止自动上传
            }}
            showUploadList={false}
          >
            <Button
              type="default"
              icon={<UploadOutlined />}
              loading={isImporting}
              style={{ backgroundColor: '#722ed1', borderColor: '#722ed1', color: 'white' }}
            >
              {isImporting ? '导入中...' : 'Excel导入'}
            </Button>
          </Upload>
          
          {selectedUserIds.length > 0 && (
            <>
              <Button
                type="default"
                icon={<SafetyOutlined />}
                onClick={() => handleBatchSetRole('admin')}
                loading={isBatchRoleLoading}
                style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16', color: 'white' }}
              >
                {isBatchRoleLoading ? '设置中...' : `设为管理员 (${selectedUserIds.length})`}
              </Button>
              
              <Button
                type="default"
                icon={<UserOutlined />}
                onClick={() => handleBatchSetRole('user')}
                loading={isBatchRoleLoading}
                style={{ backgroundColor: '#595959', borderColor: '#595959', color: 'white' }}
              >
                {isBatchRoleLoading ? '设置中...' : `设为普通用户 (${selectedUserIds.length})`}
              </Button>
              
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => setIsDeleteConfirmOpen(true)}
              >
                批量删除 ({selectedUserIds.length})
              </Button>
            </>
          )}
          
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setIsAddUserModalOpen(true)}
          >
            添加用户
          </Button>
        </Space>
      </div>

      <Table
        rowSelection={{
          selectedRowKeys: selectedUserIds,
          onChange: (selectedRowKeys) => {
            setSelectedUserIds(selectedRowKeys as string[]);
            setSelectAll(selectedRowKeys.length === users.length);
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
            handleSelectAll();
          },
        }}
        columns={[
          {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
          },
          {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            render: (text) => <Text strong>{text}</Text>,
          },
          {
            title: '密码 (加密存储)',
            dataIndex: 'password',
            key: 'password',
            render: (text) => <Text code style={{ fontSize: '12px' }}>{text}</Text>,
          },
          {
            title: '昵称',
            dataIndex: 'nickname',
            key: 'nickname',
          },
          {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
          },
          {
            title: '角色',
            dataIndex: 'role',
            key: 'role',
            render: (role) => getRoleBadge(role),
          },
          {
            title: '状态',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (status) => getStatusBadge(status),
          },
          {
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => new Date(date).toLocaleString('zh-CN'),
          },
          {
            title: '更新时间',
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (date) => new Date(date).toLocaleString('zh-CN'),
          },
          {
            title: '操作',
            key: 'action',
            render: (_, user) => (
              <Button
                type="link"
                icon={<KeyOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  openPasswordDialog(user);
                }}
              >
                修改密码
              </Button>
            ),
          },
        ]}
        dataSource={users}
        rowKey="id"
        pagination={{
          total: users.length,
          pageSize: 10,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        locale={{
          emptyText: (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <UserOutlined style={{ fontSize: 48, color: token.colorTextTertiary, marginBottom: 16 }} />
              <div>暂无用户数据</div>
            </div>
          ),
        }}
      />
      
      {/* 添加用户弹窗 */}
      <Modal
        title="添加新用户"
        open={isAddUserModalOpen}
        onCancel={() => setIsAddUserModalOpen(false)}
        footer={null}
        width={500}
      >
        <RegisterForm 
          onSuccess={() => {
            setIsAddUserModalOpen(false);
            hasInitialFetchedRef.current = false;
            fetchUsers();
          }} 
          isDialog={true} 
        />
      </Modal>
      
      {/* 修改密码对话框 */}
      <Modal
        title="修改密码"
        open={isPasswordDialogOpen}
        onCancel={() => setIsPasswordDialogOpen(false)}
        footer={[
          <Button 
            key="cancel"
            onClick={() => setIsPasswordDialogOpen(false)}
            disabled={isPasswordLoading}
          >
            取消
          </Button>,
          <Button 
            key="submit"
            type="primary"
            onClick={handlePasswordChange}
            loading={isPasswordLoading}
          >
            保存
          </Button>
        ]}
      >
        <div>
          <Text type="secondary">为用户 {selectedUser?.username} 设置新密码</Text>
          <Divider />
          <Form layout="vertical">
            <Form.Item label="新密码">
              <Input.Password
                placeholder="输入新密码"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="确认密码">
              <Input.Password
                placeholder="再次输入新密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
      
      {/* 添加用户对话框组件已移至按钮旁 */}
      
      {/* 批量删除确认对话框 */}
      <Modal
        title={
          <Space>
            <WarningOutlined style={{ color: '#ff4d4f' }} />
            <span style={{ color: '#ff4d4f' }}>确认删除</span>
          </Space>
        }
        open={isDeleteConfirmOpen}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        footer={[
          <Button 
            key="cancel"
            onClick={() => setIsDeleteConfirmOpen(false)}
          >
            取消
          </Button>,
          <Button 
            key="delete"
            danger
            icon={<DeleteOutlined />}
            onClick={handleBatchDelete}
          >
            确认删除
          </Button>
        ]}
      >
        <div>
          <Text>您确定要删除选中的 {selectedUserIds.length} 个用户吗？此操作不可恢复。</Text>
          
          <Alert
            message="警告：删除用户将同时删除与其相关的所有数据！"
            type="warning"
            showIcon
            style={{ margin: '16px 0' }}
          />
          
          <div style={{ 
            maxHeight: 160, 
            overflowY: 'auto', 
            border: `1px solid ${token.colorBorder}`, 
            borderRadius: token.borderRadius,
            padding: 8,
            backgroundColor: token.colorBgLayout
          }}>
            {users
              .filter(user => selectedUserIds.includes(user.id))
              .map(user => (
                <div key={user.id} style={{ 
                  padding: '4px 0', 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 8
                }}>
                  <CheckCircleOutlined style={{ color: token.colorPrimary }} />
                  <Text strong>{user.username}</Text>
                  {user.nickname && <Text type="secondary">({user.nickname})</Text>}
                  {user.role === 'admin' && <Tag color="red">管理员</Tag>}
                </div>
              ))}
          </div>
        </div>
      </Modal>
      
      {/* Excel导入结果对话框 */}
      <Modal
        title={
          <Space>
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
            <span style={{ color: '#52c41a' }}>Excel导入结果</span>
          </Space>
        }
        open={isImportResultsOpen}
        onCancel={() => setIsImportResultsOpen(false)}
        footer={[
          <Button 
            key="ok"
            type="primary"
            onClick={() => setIsImportResultsOpen(false)}
          >
            确定
          </Button>
        ]}
        width={600}
      >
        <div>
          <Text type="secondary">以下是Excel文件导入的详细结果</Text>
          <Divider />
          
          {importResults && (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: 16, 
                textAlign: 'center' 
              }}>
                <Card size="small" style={{ backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                    {importResults.success}
                  </div>
                  <Text style={{ color: '#389e0d' }}>成功创建</Text>
                </Card>
                <Card size="small" style={{ backgroundColor: '#e6f7ff', borderColor: '#91d5ff' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                    {importResults.skipped}
                  </div>
                  <Text style={{ color: '#096dd9' }}>跳过已存在</Text>
                </Card>
                <Card size="small" style={{ backgroundColor: '#fff1f0', borderColor: '#ffadd2' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>
                    {importResults.failed}
                  </div>
                  <Text style={{ color: '#cf1322' }}>导入失败</Text>
                </Card>
              </div>
              
              <Text>
                <Text strong>总计:</Text> {importResults.total} 条记录
              </Text>
              
              {importResults.errors && importResults.errors.length > 0 && (
                <div>
                  <Title level={5} style={{ color: '#ff4d4f' }}>错误详情:</Title>
                  <div style={{ 
                    maxHeight: 160, 
                    overflowY: 'auto', 
                    border: `1px solid #ffccc7`,
                    borderRadius: token.borderRadius,
                    padding: 8,
                    backgroundColor: '#fff1f0'
                  }}>
                    {importResults.errors.map((error: string, index: number) => (
                      <div key={index} style={{ 
                        color: '#a8071a', 
                        paddingBottom: 4,
                        fontSize: '13px'
                      }}>
                        • {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Space>
          )}
        </div>
      </Modal>
    </div>
  );
}

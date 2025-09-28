import { useState } from "react";
import { message, Button, Form, Input } from "antd";

interface RegisterFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isDialog?: boolean;
}

export default function RegisterForm({ onSuccess, onCancel, isDialog = false }: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    
    if (!username || !password || !confirmPassword) {
      message.error("请填写所有必填字段");
      return;
    }
    
    if (password !== confirmPassword) {
      message.error("两次输入的密码不一致");
      return;
    }
    
    setLoading(true);
    
    try {
      // 根据是否在对话框模式中选择不同的API端点
      const endpoint = isDialog ? "/api/users/add" : "/api/auth/register";
      
      console.log(`正在提交用户数据到: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          nickname,
          email,
        }),
      });
      
      const data = await response.json();
      console.log('API响应:', data);
      
      if (!response.ok) {
        throw new Error(data.message || "操作失败");
      }
      
      message.success(isDialog ? "用户添加成功" : "注册成功");
      
      // 清空表单
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setNickname("");
      setEmail("");
      
      // 执行成功回调
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('提交失败:', error);
      message.error(error.message || "操作失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={handleSubmit} layout="vertical" style={{ marginTop: '16px' }}>
      <Form.Item 
        label="用户名" 
        required
        tooltip="用户登录时使用的名称"
      >
        <Input
          placeholder="请输入用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Item>
      
      <Form.Item label="昵称">
        <Input
          placeholder="请输入昵称"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </Form.Item>
      
      <Form.Item label="邮箱">
        <Input
          placeholder="请输入邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Item>
      
      <Form.Item 
        label="密码" 
        required
        tooltip="请设置安全的密码"
      >
        <Input.Password
          placeholder="请输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Item>
      
      <Form.Item 
        label="确认密码" 
        required
      >
        <Input.Password
          placeholder="请再次输入密码"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </Form.Item>

      <Form.Item className="mb-0">
        {isDialog ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <Button
              onClick={onCancel}
              disabled={loading}
            >
              取消
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              添加用户
            </Button>
          </div>
        ) : (
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: '100%' }}
          >
            注册
          </Button>
        )}
      </Form.Item>
    </Form>
  );
}

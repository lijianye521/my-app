'use client';

import { useEffect } from 'react';

export default function ConsoleFilter() {
  useEffect(() => {
    // 保存原始的console方法
    const originalWarn = console.warn;
    const originalError = console.error;
    
    // 定义需要过滤的警告/错误模式
    const filterPatterns = [
      // Ant Design 相关警告
      '[antd: compatible] antd v5 support React is 16 ~ 18',
      'bodyStyle is deprecated, please use styles instead',
      
      // Form 相关警告
      'Instance created by `useForm` is not connected to any Form element',
      'Forget to pass `form` prop',
      
      // React 开发相关警告
      'There may be circular references',
      'Warning: Instance created by',
      
      // 其他开发时的噪音
      'at createUnhandledError',
      'at handleClientError',
      'at warning',
      'at warningOnce',
      'node_modules_rc-field-form',
      'node_modules_next_dist_client',
      'node_modules_fb3195ef'
    ];
    
    // 检查消息是否应该被过滤
    const shouldFilter = (message: string) => {
      return filterPatterns.some(pattern => message.includes(pattern));
    };
    
    // 重写console.warn
    console.warn = (...args) => {
      const message = args.join(' ');
      if (!shouldFilter(message)) {
        originalWarn.apply(console, args);
      }
    };
    
    // 重写console.error来过滤开发时的噪音错误
    console.error = (...args) => {
      const message = args.join(' ');
      if (!shouldFilter(message)) {
        originalError.apply(console, args);
      }
    };
    
    // 清理函数：组件卸载时恢复原始console方法
    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);
  
  return null; // 这个组件不渲染任何内容
}

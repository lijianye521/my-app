'use client';

import { useEffect } from 'react';

export default function ConsoleFilter() {
  useEffect(() => {
    // 保存原始的console.warn
    const originalWarn = console.warn;
    
    // 重写console.warn来过滤特定警告
    console.warn = (...args) => {
      const message = args.join(' ');
      
      // 过滤掉Ant Design兼容性警告
      if (message.includes('[antd: compatible] antd v5 support React is 16 ~ 18')) {
        return;
      }
      
      // 过滤掉bodyStyle废弃警告
      if (message.includes('bodyStyle is deprecated, please use styles instead')) {
        return;
      }
      
      // 过滤掉Form实例连接警告
      if (message.includes('Instance created by `useForm` is not connected to any Form element')) {
        return;
      }
      
      // 其他警告正常显示
      originalWarn.apply(console, args);
    };
    
    // 清理函数：组件卸载时恢复原始console.warn
    return () => {
      console.warn = originalWarn;
    };
  }, []);
  
  return null; // 这个组件不渲染任何内容
}

'use client';

import React from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { useServerInsertedHTML } from 'next/navigation';

const StyledComponentsRegistry = ({ children }: React.PropsWithChildren) => {
  const cache = React.useMemo(() => createCache(), []);
  const isServerInserted = React.useRef<boolean>(false);
  
  useServerInsertedHTML(() => {
    // 避免在服务端重复插入样式
    if (isServerInserted.current) {
      return;
    }
    isServerInserted.current = true;
    return (
      <style 
        id="antd" 
        dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} 
      />
    );
  });
  
  return <StyleProvider cache={cache}>{children}</StyleProvider>;
};

export default StyledComponentsRegistry;
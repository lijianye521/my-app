"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface NotificationProps {
  title: string;
  message: string;
  type: "success" | "error";
  onClose?: () => void;
}

export default function AuthNotification({ 
  title, 
  message, 
  type = "success", 
  onClose 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  // 自动关闭
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 3000); // 3秒后自动关闭
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };
  
  if (!isVisible) return null;
  
  return (
    <div 
      className={`fixed right-5 top-5 w-96 max-w-[90vw] rounded-md shadow-lg p-4 z-50
        ${type === "success" ? "bg-green-50 border-l-4 border-green-500" : "bg-red-50 border-l-4 border-red-500"}
      `}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`font-bold text-lg ${type === "success" ? "text-green-700" : "text-red-700"}`}>
            {title}
          </h3>
          <p className={`mt-1 ${type === "success" ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        </div>
        <button 
          onClick={handleClose}
          className={`p-1.5 rounded-full hover:bg-gray-200 transition-colors
            ${type === "success" ? "text-green-700" : "text-red-700"}
          `}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
} 
import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type];

  return (
    <div className={`fixed top-5 right-5 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-4 animate-slideIn z-50`}>
      <div className="flex-1">{message}</div>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 font-bold text-xl"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
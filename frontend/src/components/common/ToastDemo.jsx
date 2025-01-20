import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  ShoppingBag,
} from 'lucide-react';

const Toast = ({
  message = '',
  type = 'success',
  duration = 3000,
  onClose,
  description = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.max(prev - 100 / (duration / 10), 0));
    }, 10);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [duration, onClose]);

  const getIcon = () => {
    const iconProps = 'w-6 h-6';
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconProps} text-green-500`} />;
      case 'error':
        return <XCircle className={`${iconProps} text-red-500`} />;
      case 'warning':
        return <AlertCircle className={`${iconProps} text-yellow-500`} />;
      case 'loading':
        return (
          <Loader2 className={`${iconProps} text-blue-500 animate-spin`} />
        );
      case 'order':
        return <ShoppingBag className={`${iconProps} text-purple-500`} />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-l-4 border-l-green-500';
      case 'error':
        return 'bg-red-50 border-l-4 border-l-red-500';
      case 'warning':
        return 'bg-yellow-50 border-l-4 border-l-yellow-500';
      case 'loading':
        return 'bg-blue-50 border-l-4 border-l-blue-500';
      case 'order':
        return 'bg-purple-50 border-l-4 border-l-purple-500';
      default:
        return 'bg-gray-50 border-l-4 border-l-gray-500';
    }
  };

  if (!isVisible) return null;

  return (
    <div className='fixed top-4 right-4 z-50 min-w-[320px] max-w-md animate-slideIn'>
      <div className={`${getBgColor()} rounded-lg shadow-lg overflow-hidden`}>
        <div className='p-4'>
          <div className='flex gap-3'>
            {getIcon()}
            <div className='flex-1'>
              <h3 className='font-medium text-gray-900'>{message}</h3>
              {description && (
                <p className='mt-1 text-sm text-gray-600'>{description}</p>
              )}
            </div>
            <button
              onClick={() => {
                setIsVisible(false);
                onClose?.();
              }}
              className='text-gray-400 hover:text-gray-600 transition-colors'
            >
              <XCircle className='w-5 h-5' />
            </button>
          </div>
        </div>
        <div className='h-1 bg-gray-100'>
          <div
            className='h-full bg-current transition-all duration-100 ease-linear'
            style={{
              width: `${progress}%`,
              backgroundColor:
                type === 'success'
                  ? '#10B981'
                  : type === 'error'
                    ? '#EF4444'
                    : type === 'warning'
                      ? '#F59E0B'
                      : type === 'loading'
                        ? '#3B82F6'
                        : type === 'order'
                          ? '#8B5CF6'
                          : '#6B7280',
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default Toast;

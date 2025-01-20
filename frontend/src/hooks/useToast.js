import { toast } from 'react-toastify';

const defaultConfig = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light',
  icon: true,
  style: {
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '1.5',
  },
};

export const useToast = () => {
  const showSuccess = (message) => {
    toast.success(message, {
      ...defaultConfig,
      icon: '🎉',
    });
  };

  const showError = (message) => {
    toast.error(message, {
      ...defaultConfig,
      icon: '❌',
    });
  };

  const showInfo = (message) => {
    toast.info(message, {
      ...defaultConfig,
      icon: 'ℹ️',
    });
  };

  const showWarning = (message) => {
    toast.warning(message, {
      ...defaultConfig,
      icon: '⚠️',
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};

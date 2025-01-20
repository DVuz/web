// import { useContext } from 'react';
// import { AuthContext } from '../contexts/AuthContext';

// const useAuth = () => {
//   return useContext(AuthContext); // Trả về context của Auth
// };

// export default useAuth;
// hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;

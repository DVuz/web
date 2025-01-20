import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext();

// API endpoints
const AUTH_ENDPOINTS = {
  CHECK_TOKEN: '/auth/verify',
  REFRESH_TOKEN: '/refresh',
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        // Set default authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        return { accessToken: storedToken, decodedToken };
      } catch (error) {
        localStorage.removeItem('accessToken');
        delete api.defaults.headers.common['Authorization'];
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(true);

  // Function to check token expiration
  const isTokenExpiringSoon = useCallback((decodedToken) => {
    if (!decodedToken?.exp) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationThreshold = 5 * 60; // 5 minutes
    return decodedToken.exp - currentTime <= expirationThreshold;
  }, []);

  // Function to check token validity with backend
  const checkAccessToken = async (token) => {
    try {
      const response = await api.post(AUTH_ENDPOINTS.CHECK_TOKEN, { token });
      return response.data;
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false };
    }
  };

  // Function to refresh token
  const handleRefreshToken = useCallback(async () => {
    try {
      const response = await api.post(AUTH_ENDPOINTS.REFRESH_TOKEN);
      const newAccessToken = response.data.accessToken;

      if (newAccessToken) {
        const decodedToken = jwtDecode(newAccessToken);
        setUser({ accessToken: newAccessToken, decodedToken });
        localStorage.setItem('accessToken', newAccessToken);
        api.defaults.headers.common['Authorization'] =
          `Bearer ${newAccessToken}`;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      setUser(null);
      localStorage.removeItem('accessToken');
      delete api.defaults.headers.common['Authorization'];
      return false;
    }
  }, []);

  // Setup automatic token refresh
  useEffect(() => {
    let refreshInterval;

    const setupTokenRefresh = () => {
      if (user?.decodedToken) {
        refreshInterval = setInterval(async () => {
          if (isTokenExpiringSoon(user.decodedToken)) {
            await handleRefreshToken();
          }
        }, 60000);
      }
    };

    setupTokenRefresh();

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [user, isTokenExpiringSoon, handleRefreshToken]);

  // Initial token verification
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('accessToken');

      if (storedToken) {
        try {
          const decodedToken = jwtDecode(storedToken);

          if (isTokenExpiringSoon(decodedToken)) {
            await handleRefreshToken();
          } else {
            const response = await checkAccessToken(storedToken);
            if (!response.valid) {
              await handleRefreshToken();
            } else {
              api.defaults.headers.common['Authorization'] =
                `Bearer ${storedToken}`;
            }
          }
        } catch (error) {
          console.error('Token verification error:', error);
          setUser(null);
          localStorage.removeItem('accessToken');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, [handleRefreshToken, isTokenExpiringSoon]);

  // Setup axios interceptors
  useEffect(() => {
    // Request interceptor
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (user?.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshed = await handleRefreshToken();
            if (refreshed && user?.accessToken) {
              originalRequest.headers.Authorization = `Bearer ${user.accessToken}`;
              return api(originalRequest);
            }
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [handleRefreshToken, user]);

  const login = useCallback((userData) => {
    try {
      const decodedToken = jwtDecode(userData.accessToken);
      setUser({ accessToken: userData.accessToken, decodedToken });
      localStorage.setItem('accessToken', userData.accessToken);
      api.defaults.headers.common['Authorization'] =
        `Bearer ${userData.accessToken}`;
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('accessToken');
    delete api.defaults.headers.common['Authorization'];
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        refreshToken: handleRefreshToken,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

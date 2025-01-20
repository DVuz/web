import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { CartProvider } from './contexts/CartProvider';
import { ChatProvider } from './contexts/ChatProvider';
import UserLayout from './layout/UserLayout';
import AdminLayout from './layout/AdminLayout';
import AuthWrapper from './AuthWrapper/AuthWrapper';
import VideoCallPage from './components/page/userpage/call';
import { userRoutes } from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import ChatWidget from './components/page/userpage/ChatWidget';
import GlobalCallModal from './components/shared/CallMessenger/GlobalCallModal';
import { WebRTCProvider } from './contexts/WebRTCContext';
import ScrollToTop from './components/common/ScrollToTop';

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <WebRTCProvider>
              <ChatProvider>
                <CartProvider>
                  <Router>
                    <ScrollToTop />
                    <div>
                      <Routes>
                        {/* Video call routes */}
                        <Route
                          path='/video_call/group/:roomId'
                          element={<VideoCallPage />}
                        />
                        <Route
                          path='/video_call/personal/:roomId'
                          element={<VideoCallPage />}
                        />

                        {/* Admin routes with AdminLayout */}
                        <Route
                          path='/admin'
                          element={
                            <AuthWrapper adminRequired>
                              <AdminLayout />
                            </AuthWrapper>
                          }
                        >
                          {adminRoutes[0].children.map((route) => (
                            <Route
                              key={route.path || 'index'}
                              index={route.index}
                              path={route.path}
                              element={route.element}
                            />
                          ))}
                        </Route>

                        {/* User routes with UserLayout */}
                        <Route element={<UserLayout />}>
                          {userRoutes.map((route) => {
                            if (route.children) {
                              return (
                                <Route
                                  key={route.path}
                                  path={route.path}
                                  element={route.element}
                                >
                                  {route.children.map((child) => (
                                    <Route
                                      key={`${route.path}-${child.path || 'index'}`}
                                      index={child.index}
                                      path={child.path}
                                      element={child.element}
                                    />
                                  ))}
                                </Route>
                              );
                            }
                            return (
                              <Route
                                key={route.path}
                                path={route.path}
                                element={route.element}
                              />
                            );
                          })}
                        </Route>

                        {/* Catch all route */}
                        <Route
                          path='*'
                          element={<Navigate to='/404' replace />}
                        />
                      </Routes>
                      <ChatWidget />
                      <GlobalCallModal />
                    </div>
                  </Router>
                </CartProvider>
              </ChatProvider>
            </WebRTCProvider>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;

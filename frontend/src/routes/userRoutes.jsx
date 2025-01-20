import { Navigate } from 'react-router-dom';
import { Login, Register, ForgetPassword } from '../components/auth';
import Text from '../components/text';
import Error404 from '../components/Error/Error404';
import Copy from '../components/Copy';
import HomePage from '../components/page/HomePage';
import AboutUsPage from '../components/page/AboutUsPage';
import Contact from '../components/page/Contact';
import Test from '../components/test';
import AccountPage from '../components/page/userpage/AccountPage';
import PersonalInformation from '../components/shared/PersonalInformation';
import AddressInformation from '../components/shared/AddressInformation';
import Security from '../components/shared/Security';
import Messenger from '../components/page/userpage/Messenger';
import AuthWrapper from '../AuthWrapper/AuthWrapper';
import ProductList from '../components/page/userpage/productpage/ProductList';
import ProductDetail from '../components/page/userpage/productpage/ProductDetail';
import ShoppingCart from '../components/page/userpage/cart/ShoppingCart';
import OrderTracking from '../components/page/userpage/cart/OrderTracking';
import FavoriteProductsList from '../components/page/userpage/productpage/FavoriteProductsList';
import OrderList from '../components/page/userpage/productpage/OrderList';
import CustomerOrders from '../components/page/userpage/productpage/CustomerOrders';
import CartList from '../components/page/userpage/cart/CartList';
import StorePolicy from '../components/page/StorePolicy';
import ChatWidget from '../components/page/userpage/ChatWidget';

// Helper function remains the same
const wrapProtectedRoutes = (routes) => {
  return routes.map((route) => {
    if (route.children) {
      return {
        ...route,
        element: <AuthWrapper>{route.element}</AuthWrapper>,
        children: wrapProtectedRoutes(route.children),
      };
    }
    return {
      ...route,
      element: <AuthWrapper>{route.element}</AuthWrapper>,
    };
  });
};

export const publicRoutes = [
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgotPassword', element: <ForgetPassword /> },
  { path: '/404', element: <Error404 /> },
  { path: '/about_us', element: <AboutUsPage /> },
  { path: '/contact', element: <Contact /> },
  { path: '/messenger', element: <Messenger /> },
  { path: '/products', element: <ProductList /> },
  { path: '/productDetail/:productName', element: <ProductDetail /> },
  { path: '/storepolicy', element: <StorePolicy /> },
  { path: '/chatwidget', element: <ChatWidget /> },
  { path: '/text', element: <Text /> },
];

export const protectedRoutesConfig = [
  { path: '/copy', element: <Copy /> },
  { path: '/test', element: <Test /> },
  {
    path: '/account',
    element: <AccountPage />,
    children: [
      {
        index: true,
        element: <Navigate to='personInfo' replace />,
      },
      {
        path: 'personInfo',
        element: (
          <div className='space-y-6'>
            <PersonalInformation />
            <AddressInformation />
          </div>
        ),
      },
      {
        path: 'security',
        element: <Security />,
      },
    ],
  },
  {
    path: 'shoppingcart',
    element: <ShoppingCart />,
  },
  {
    path: 'ordertracking',
    element: <OrderTracking />,
  },
  {
    path: 'favorite',
    element: <FavoriteProductsList />,
  },
  {
    path: 'orderlist',
    element: <OrderList />,
  },
  {
    path: 'customerorders',
    element: <CustomerOrders />,
  },
  {
    path: 'cartlist',
    element: <CartList />,
  },
];

export const protectedRoutes = wrapProtectedRoutes(protectedRoutesConfig);
export const userRoutes = [...publicRoutes, ...protectedRoutes];

export default userRoutes;

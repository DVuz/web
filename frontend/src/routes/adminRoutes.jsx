import { Navigate } from 'react-router-dom';
import AdminDashboard from '../components/page/adminpage/AdminDashBoard';
import AdminDashboardTest from '../components/page/adminpage/dashboardTest';
import CreateProduct from '../components/page/adminpage/product/CreateProduct';
import CategoryManagementForm from '../components/page/adminpage/category/CategoryManagementForm';
import CategoryLists from '../components/page/adminpage/category/CategoryLists';
import ManufacturerForm from '../components/page/adminpage/manufacturer/ManufacturerForm';
import ManufacturerList from '../components/page/adminpage/manufacturer/ManufacturerList';
import WarehouseForm from '../components/page/adminpage/warehouse/WarehouseForm';
import WarehouseList from '../components/page/adminpage/warehouse/WarehouseList';
import BatchEntryForm from '../components/page/adminpage/batch/Batch';
import BatchListView from '../components/page/adminpage/batch/BatchListView';
import DiscountForm from '../components/page/adminpage/discount/DiscountForm';
import DiscountListView from '../components/page/adminpage/discount/DiscountListView';
import ShippingFee from '../components/page/adminpage/shippingfee/ShippingFee';
import ShippingFeeList from '../components/page/adminpage/shippingfee/ShippingFeeList';
import ProductSerialList from '../components/page/adminpage/product/ProductSerialList';
import CategoryForm from '../components/page/adminpage/category/CategoryForm';
import ProductTypeForm from '../components/page/adminpage/category/ProductTypeForm';
import SubcategoryForm from '../components/page/adminpage/category/SubcategoryForm';
import ProductList from '../components/page/adminpage/product/ProductList';
import AuthWrapper from '../AuthWrapper/AuthWrapper';
import Messenger from '../components/page/userpage/Messenger';

const adminRoutes = [
  {
    path: '/admin',
    element: <AuthWrapper adminRequired={true}></AuthWrapper>,
    children: [
      { index: true, element: <Navigate to='/admin/dashboard' replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'products/create', element: <CreateProduct /> },
      { path: 'products/list', element: <ProductList /> },
      { path: 'products/serial_list', element: <ProductSerialList /> },
      { path: 'categories/form', element: <CategoryForm /> },
      { path: 'categories/producttype', element: <ProductTypeForm /> },
      { path: 'categories/subcategory', element: <SubcategoryForm /> },
      { path: 'categories/types/list', element: <CategoryLists /> },
      { path: 'manufacturer/create', element: <ManufacturerForm /> },

      { path: 'manufacturer/list', element: <ManufacturerList /> },
      { path: 'warehouse/create', element: <WarehouseForm /> },
      { path: 'warehouse/list', element: <WarehouseList /> },
      { path: 'batch/create', element: <BatchEntryForm /> },
      { path: 'batch/list', element: <BatchListView /> },
      { path: 'discounts/create', element: <DiscountForm /> },
      { path: 'discounts/list', element: <DiscountListView /> },
      { path: 'shippingfee/create', element: <ShippingFee /> },
      { path: 'shippingfee/list', element: <ShippingFeeList /> },
    ],
  },
  {
    path: 'messenger',
    element: <Messenger />,
  },
];
export default adminRoutes;

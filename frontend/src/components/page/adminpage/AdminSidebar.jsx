import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  Users,
  Settings,
  Package,
  Truck,
  Tag,
  Receipt,
  BarChart3,
  ChevronLeft,
  LucideWarehouse,
  ListChecks,
  Factory,
} from 'lucide-react';
import { FaIndustry } from 'react-icons/fa';
import logoImage from '../../../assets/logo.png';

const SubMenuTooltip = ({ items, label, style }) => {
  return (
    <div
      style={style}
      className='fixed bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] z-[1000]'
    >
      <div className='px-4 py-2 border-b border-gray-200'>
        <span className='font-medium text-gray-900'>{label}</span>
      </div>
      <div className='p-2 '>
        {items.map((item, index) => (
          <Link
            key={index}
            to={`/admin/${label.toLowerCase()}/${item.path}`}
            className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 rounded-lg'
          >
            <div className='w-2 h-2 rounded-full bg-gray-300 mr-3' />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

const SidebarItem = ({
  icon: Icon,
  label,
  children,
  isOpen,
  onClick,
  isCollapsed,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const itemRef = useRef(null);
  const hasChildren = children && children.length > 0;
  const tooltipTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (isCollapsed && hasChildren && itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top,
        left: rect.right + 12, // Add some spacing
      });
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowTooltip(true);
      }, 500);
    }
  };

  const handleMouseLeave = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setShowTooltip(false);
  };

  return (
    <div
      ref={itemRef}
      className='relative mb-2'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        onClick={onClick}
        className={`
          flex items-center 
          ${isCollapsed ? 'justify-center' : ''} 
          px-4 py-3 cursor-pointer 
          transition-all duration-200 rounded-lg
          ${isOpen ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}
        `}
      >
        <Icon
          className={`
            min-w-[20px] min-h-[20px] w-5 h-5 
            ${isCollapsed ? '' : 'mr-3'} 
            ${isOpen ? 'text-blue-600' : 'text-gray-600'}
          `}
        />
        {!isCollapsed && (
          <>
            <span
              className={`flex-1 font-medium ${isOpen ? 'text-blue-600' : 'text-gray-700'}`}
            >
              {label}
            </span>
            {hasChildren && (
              <ChevronDown
                className={`
                  w-4 h-4 transition-transform duration-200 
                  ${isOpen ? 'rotate-180 text-blue-600' : 'text-gray-400'}
                `}
              />
            )}
          </>
        )}
      </div>

      {/* Expanded Submenu */}
      {hasChildren && isOpen && !isCollapsed && (
        <div className='ml-4 mt-2 space-y-1'>
          {children.map((item, index) => (
            <Link
              key={index}
              to={`/admin/${label.toLowerCase()}/${item.path}`}
              className='flex items-center px-4 py-2.5 text-sm cursor-pointer group hover:bg-gray-50 rounded-lg transition-colors duration-150'
            >
              <div className='w-2 h-2 rounded-full bg-gray-300 mr-3 group-hover:bg-blue-400 transition-colors duration-150' />
              <span className='text-gray-600 group-hover:text-blue-600 transition-colors duration-150'>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Tooltip Submenu */}
      {isCollapsed && hasChildren && showTooltip && (
        <SubMenuTooltip
          items={children}
          label={label}
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        />
      )}
    </div>
  );
};

const AdminSidebar = () => {
  const [openItem, setOpenItem] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = {
    Products: [
      { label: 'Create Product', path: 'create' },
      { label: 'Product List', path: 'list' },
      { label: 'ProductSerial', path: 'serial_list' },
      { label: 'Inventory Management', path: 'inventory' },
    ],
    'Categories/Types': [
      { label: 'Create', path: 'create' },
      { label: 'View', path: 'list' },
      { label: 'Delete', path: 'delete' },
    ],
    Users: [
      { label: 'Add User', path: 'create' },
      { label: 'User List', path: 'list' },
      { label: 'User Roles', path: 'roles' },
      { label: 'Access Control', path: 'access' },
    ],
    Orders: [
      { label: 'New Orders', path: 'new' },
      { label: 'Processing Orders', path: 'processing' },
      { label: 'Completed Orders', path: 'completed' },
      { label: 'Order History', path: 'history' },
    ],
    Warehouse: [
      { label: 'Create warehouse', path: 'create' },
      { label: 'Warehouse List', path: 'list' },
    ],
    Batch: [
      { label: 'Create Batch', path: 'create' },
      { label: 'Batch List', path: 'list' },
    ],
    Manufacturer: [
      { label: 'Create manufacturer', path: 'create' },
      { label: 'Manufacturer List', path: 'list' },
    ],
    ShippingFee: [
      { label: 'Create Shipping Fee', path: 'create' },
      { label: 'Shipping Fee List', path: 'list' },
    ],
    Discounts: [
      { label: 'Create Discount', path: 'create' },
      { label: 'Discount lists', path: 'list' },
      { label: 'Coupon Codes', path: 'coupons' },
      { label: 'Promotion History', path: 'history' },
    ],
  };

  const handleItemClick = (label) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setOpenItem(label);
    } else {
      setOpenItem((prev) => (prev === label ? null : label));
    }
  };

  return (
    <div
      className={`
      ${isCollapsed ? 'w-20' : 'w-64'} 
      h-screen bg-white border-r border-gray-200 
      flex flex-col transition-all duration-300 
      relative z-[900]
    `}
    >
      {/* Header */}
      <div className='h-16 border-b border-gray-200 flex items-center justify-between px-4'>
        <Link
          to='/admin'
          className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'space-x-3'}`}
        >
          <div className='min-w-[40px]'>
            <img
              src={logoImage}
              alt='Logo'
              className='w-10 h-10 rounded-xl cursor-pointer'
            />
          </div>
          {!isCollapsed && (
            <h1 className='text-xl font-bold text-gray-800'>Admin</h1>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className='min-w-[32px] w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors duration-150'
        >
          <ChevronLeft
            className={`
            w-5 h-5 text-gray-600 
            transition-transform duration-200 
            ${isCollapsed ? 'hidden' : ''}
          `}
          />
        </button>
      </div>

      {/* Sidebar Items */}
      <div className='flex-1 overflow-y-auto p-4'>
        {Object.entries(menuItems).map(([label, children]) => (
          <SidebarItem
            key={label}
            icon={getIconForLabel(label)}
            label={label}
            isOpen={openItem === label}
            onClick={() => handleItemClick(label)}
            children={children}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
    </div>
  );
};

// Helper function to get icon for each label
const getIconForLabel = (label) => {
  const icons = {
    Products: Package,
    'Categories/Types': Package,
    Users: Users,
    Orders: Receipt,
    Shipping: Truck,
    Promotions: Tag,
    Reports: BarChart3,
    Settings: Settings,
    Warehouse: LucideWarehouse,
    Batch: ListChecks,
    ShippingFee: Truck,
    Discounts: Tag,
    Manufacturer: Factory,
  };
  return icons[label] || Package;
};

export default AdminSidebar;

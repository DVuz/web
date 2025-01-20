import api from './api';

/**
 * Hàm gọi API dùng chung chỉ cho phương thức GET
 * @param {string} endpoint - Endpoint API (ví dụ: '/categories/get_all_category')
 * @returns {Promise<any>} - Trả về dữ liệu từ API hoặc ném lỗi
 */
// export const fetchApi = async (endpoint) => {
//   try {
//     const response = await api.get(endpoint);

//     if (response.data.success) {
//       return response.data; // Trả về dữ liệu nếu success
//     } else {
//       throw new Error(response.data.message || 'API Error');
//     }
//   } catch (error) {
//     console.error(`API GET Error [${endpoint}]:`, error.message);
//     throw error; // Để xử lý lỗi ở nơi sử dụng hàm
//   }
// };
export const fetchApi = async (endpoint, accessToken = null) => {
  try {
    const config = {};

    if (accessToken) {
      config.headers = {
        Authorization: `Bearer ${accessToken}`,
      };
    }

    const response = await api.get(endpoint, config);

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'API Error');
    }
  } catch (error) {
    console.error(`API GET Error [${endpoint}]:`, error.message);
    throw error;
  }
};

/**
 * Hàm lấy danh mục bằng API
 * @returns {Promise<any>} - Trả về danh mục hoặc ném lỗi
 */

// export const getGeoList = () => fetchApi('/geo/getList');
// export const getAddressInfoUser = (accessToken) => fetchApi('/addresses', accessToken);
export const getAddressInfo = (accessToken) => fetchApi('/addresses', accessToken);
export const getGeoList = () => fetchApi('/geo/getList');
export const getAddressInfoUser = (accessToken) => fetchApi('/addresses/address_with_user', accessToken);

//fee
export const getShippingFees = () => fetchApi('/shippingFree');

export const getAllCategories = () => fetchApi('/categories/get_all_category');
export const getAllCategoriesNested = () =>
  fetchApi('/categories/get_all_category_nested');

export const getAllSubcategories = () =>
  fetchApi('/subcategories/get_all_subcategory');
export const getAllWarehouses = () =>
  fetchApi('/warehouses/get_all_warehouses');
export const deleteWarehouse = (id) =>
  fetchApi(`/warehouses/delete_warehouse/${id}`);
export const updateWarehouse = (id, data) =>
  fetchApi(`/warehouses/update_warehouse/${id}`, data);

export const getAllManufacturers = () => fetchApi('/manufacturers');
export const deleteManufacturer = (id) => fetchApi(`/manufacturers/${id}`);
export const updateManufacturer = (id, data) =>
  fetchApi(`/manufacturers/${id}`, data);

export const getAllProductTypes = () =>
  fetchApi('/subcategories/get_all_product_type');

export const getAllProducts = () => fetchApi('/get_all_products');
export const getUserInfoByEmail = (accessToken) =>
  fetchApi(`/users/get_user_by_email`, accessToken);

export const getConversations = () =>
  fetchApi('/conversation/user_conversations');
export const getMessages = (
  conversationId,
  accessToken,
  lastMessageId = null
) => {
  const endpoint = `/messages/get_message/${conversationId}${lastMessageId ? `?last_message_id=${lastMessageId}` : ''}`;
  console.log('Requesting messages with endpoint:', endpoint);
  return fetchApi(endpoint, accessToken);
};

export const searchUsers = (searchTerm, accessToken) =>
  fetchApi(`/users/search?searchTerm=${searchTerm}`, accessToken);

//file media
export const getMediaByType = async (
  conversationId,
  type,
  accessToken,
  params = {}
) => {
  const queryParams = new URLSearchParams();

  if (params.last_message_id) {
    queryParams.append('last_message_id', params.last_message_id);
  }
  if (params.limit) {
    queryParams.append('limit', params.limit);
  }

  const queryString = queryParams.toString();
  const endpoint = `/messages/${conversationId}/media/${type}${queryString ? `?${queryString}` : ''}`;

  return fetchApi(endpoint, accessToken);
};

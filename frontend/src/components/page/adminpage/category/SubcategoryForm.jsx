import GenericForm from './GenericForm';
import { uploadSubCategory } from '../../../../services/uploadService';
import { getAllCategories } from '../../../../services/getApi';

export default function SubcategoryForm() {
  const fetchCategories = async () => {
    try {
      const { categories } = await getAllCategories();

      // Kiểm tra nếu categories không phải là mảng
      if (!Array.isArray(categories)) {
        throw new Error('Invalid data format: categories is not an array');
      }

      // Map dữ liệu trả về thành cấu trúc cần thiết
      return categories.map((category) => ({
        id: category.category_id,
        name_en: category.category_name_en.trim(), // Loại bỏ khoảng trắng thừa
        name_vn: category.category_name_vn.trim(),
        description_en: category.description_en || '',
        description_vn: category.description_vn || '',
        image_url: category.image_url || '',
        display_order: category.display_order || 0,
        status: category.status || 'inactive',
      }));
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      throw error; // Ném lỗi để xử lý ở cấp cao hơn
    }
  };

  const handleUploadProductType = async (formData) => {
    try {
      const response = await uploadSubCategory(formData);
      return response;
    } catch (error) {
      console.error('Error uploading subcategory:', error);
      throw error;
    }
  };
  return (
    <GenericForm
      formType='subcategory'
      uploadFunction={handleUploadProductType}
      fetchParentOptions={fetchCategories}
      translationNamespace='categoryManagementForm'
    />
  );
}

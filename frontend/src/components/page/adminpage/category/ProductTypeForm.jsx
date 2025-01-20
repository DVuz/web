import GenericForm from './GenericForm';
import { uploadProductType } from '../../../../services/uploadService';
import { getAllSubcategories } from '../../../../services/getApi';

export default function ProductTypeForm() {
  const fetchSubcategories = async () => {
    try {
      const { subcategories } = await getAllSubcategories();

      if (!Array.isArray(subcategories)) {
        throw new Error('Invalid data format: subcategories is not an array');
      }

      return subcategories.map((subcategory) => ({
        id: subcategory.subcategory_id,
        name_en: subcategory.subcategory_name_en?.trim() || '',
        name_vn: subcategory.subcategory_name_vn?.trim() || '',
        description_en: subcategory.description_en || '',
        description_vn: subcategory.description_vn || '',
        image_url: subcategory.image_url || '',
        display_order: subcategory.display_order || 0,
        status: subcategory.status || 'inactive',
      }));
    } catch (error) {
      console.error('Error fetching subcategories:', error.message);
      throw error;
    }
  };

  // Sửa lại hàm này - đổi tên để tránh trùng với import
  const handleUploadProductType = async (formData) => {
    try {
      const response = await uploadProductType(formData);
      return response;
    } catch (error) {
      console.error('Error uploading product type:', error);
      throw error;
    }
  };

  return (
    <GenericForm
      formType='productType'
      uploadFunction={handleUploadProductType} // Sử dụng hàm mới
      fetchParentOptions={fetchSubcategories}
      translationNamespace='categoryManagementForm'
      extraFields={[
        {
          name: 'typeCode',
          label: 'typeCode',
          type: 'text',
          placeholder: 'enterTypeCode',
          defaultValue: '',
        },
      ]}
    />
  );
}

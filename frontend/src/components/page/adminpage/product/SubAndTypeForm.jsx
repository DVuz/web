import { useState } from 'react';
import { validateForm } from '../../../../utils/formValidation';
import Input from '../../../common/Input';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { useTranslationLoader } from '../../../../hooks/useTranslationLoader';
import { uploadSubcategory } from '../../../../services/uploadService';

export default function SubcategoryForm({ categories, type = 'subcategory' }) {
  useTranslationLoader('subcategoryManagementForm');
  const { language } = useLanguage();
  const { t } = useTranslation('subcategoryManagementForm');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    names: {
      name_en: '',
      name_vn: '',
    },
    descriptions: {
      description_en: '',
      description_vn: '',
    },
    image: null,
    displayOrder: '',
    status: 'active',
    categoryId: '',
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setErrors(prev => ({
          ...prev,
          image: t('invalidImageType')
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({ ...prev, image: file }));
        setErrors(prev => ({ ...prev, image: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm(formData, type, language, t);
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const formPayload = new FormData();
      formPayload.append('formType', type);
      formPayload.append('name_en', formData.names.name_en);
      formPayload.append('name_vn', formData.names.name_vn);
      formPayload.append('description_en', formData.descriptions.description_en);
      formPayload.append('description_vn', formData.descriptions.description_vn);
      formPayload.append('image', formData.image);
      formPayload.append('display_order', formData.displayOrder);
      formPayload.append('status', formData.status);
      formPayload.append('category_id', formData.categoryId);

      const response = await uploadSubcategory(formPayload);
      console.log(`${type} upload success:`, response);

      setFormData({
        names: { name_en: '', name_vn: '' },
        descriptions: { description_en: '', description_vn: '' },
        image: null,
        displayOrder: '',
        status: 'active',
        categoryId: '',
      });
      setPreviewImage(null);
    } catch (error) {
      console.error(`${type} upload failed:`, error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || t('uploadFailed')
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, subfield) => (value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subfield]: value,
      },
    }));
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 overflow-y-auto h-full">
      <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white">
            {t(`create${type}`)}
          </h2>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('category')}
              </label>
              <select
                className="w-full p-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
                }
              >
                <option value="">{t('selectCategory')}</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {language === 'en' ? category.name_en : category.name_vn}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-sm text-red-600 mt-1">{errors.categoryId}</p>
              )}
            </div>

            <Input
              labelText={t('nameEn')}
              typeInput="text"
              placeholder={t('enterNameInEnglish')}
              inputValue={handleInputChange('names', 'name_en')}
              error={errors.name_en}
            />

            <Input
              labelText={t('nameVn')}
              typeInput="text"
              placeholder={t('enterNameInVietnamese')}
              inputValue={handleInputChange('names', 'name_vn')}
              error={errors.name_vn}
            />

            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-gray-700">{t('description')} (EN)</h2>
              <ReactQuill
                theme="snow"
                value={formData.descriptions.description_en}
                onChange={handleInputChange('descriptions', 'description_en')}
                className={`mt-2 ${errors.description_en ? 'quill-error' : ''}`}
              />
              {errors.description_en && (
                <p className="text-sm text-red-600 mt-2">{errors.description_en}</p>
              )}
            </div>

            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-gray-700">{t('description')} (VN)</h2>
              <ReactQuill
                theme="snow"
                value={formData.descriptions.description_vn}
                onChange={handleInputChange('descriptions', 'description_vn')}
                className={`mt-2 ${errors.description_vn ? 'quill-error' : ''}`}
              />
              {errors.description_vn && (
                <p className="text-sm text-red-600 mt-2">{errors.description_vn}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('imageUrl')}
              </label>
              <div className="mt-1 flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
                />
                {previewImage && (
                  <div className="mt-4 relative">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-w-xs h-48 rounded-lg shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setFormData(prev => ({ ...prev, image: null }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              {errors.image && (
                <p className="text-sm text-red-600 mt-2">{errors.image}</p>
              )}
            </div>

            <Input
              labelText={t('displayOrder')}
              typeInput="number"
              placeholder={t('enterDisplayOrder')}
              inputValue={(value) =>
                setFormData((prev) => ({ ...prev, displayOrder: value }))
              }
              error={errors.displayOrder}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('status')}
              </label>
              <select
                className="w-full p-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option value="active">{t('active')}</option>
                <option value="inactive">{t('inactive')}</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isSubmitting ? t('creating') : t(`create${type}`)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Example usage for Type form
// TypeForm.jsx
export default function TypeForm({ categories }) {
  return <SubcategoryForm categories={categories} type="type" />;
}
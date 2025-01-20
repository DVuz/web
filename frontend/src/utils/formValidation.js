export const validateForm = (formData, formType, language, t) => {
  const newErrors = {};

  const getErrorMessage = (key) => {
    const errorMessages = {
      en: {
        name_en: `${formType} name (EN) is required`,
        name_vn: `${formType} name (VN) is required`,
        description_en: t('description') + ' (EN) ' + t('isRequired'),
        description_vn: t('description') + ' (VN) ' + t('isRequired'),
        image: t('image') + ' ' + t('isRequired'),
        imageSize: t('imageSizeTooLarge'),
        imageType: t('invalidImageType'),
        displayOrder: t('displayOrder') + ' ' + t('isRequired'),
      },
      vi: {
        name_en: `${formType} tên (EN) là bắt buộc`,
        name_vn: `${formType} tên (VN) là bắt buộc`,
        description_en: t('description') + ' (EN) ' + t('isRequired'),
        description_vn: t('description') + ' (VN) ' + t('isRequired'),
        image: t('image') + ' ' + t('isRequired'),
        imageSize: t('imageSizeTooLarge'),
        imageType: t('invalidImageType'),
        displayOrder: t('displayOrder') + ' ' + t('isRequired'),
      },
    };
    return errorMessages[language][key] || '';
  };

  // Validate names
  if (!formData.names.name_en?.trim()) {
    newErrors.name_en = getErrorMessage('name_en');
  }

  if (!formData.names.name_vn?.trim()) {
    newErrors.name_vn = getErrorMessage('name_vn');
  }

  // Validate descriptions
  if (!formData.descriptions.description_en?.trim()) {
    newErrors.description_en = getErrorMessage('description_en');
  }

  if (!formData.descriptions.description_vn?.trim()) {
    newErrors.description_vn = getErrorMessage('description_vn');
  }

  // Validate image
  if (!formData.image) {
    newErrors.image = getErrorMessage('image');
  } else if (formData.image instanceof File) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(formData.image.type)) {
      newErrors.image = getErrorMessage('imageType');
    }
    if (formData.image.size > 5 * 1024 * 1024) {
      // 5MB limit
      newErrors.image = getErrorMessage('imageSize');
    }
  }

  // Validate display order
  if (!formData.displayOrder) {
    newErrors.displayOrder = getErrorMessage('displayOrder');
  } else if (isNaN(formData.displayOrder) || formData.displayOrder < 1) {
    newErrors.displayOrder = t('positiveNumber');
  }

  return newErrors;
};

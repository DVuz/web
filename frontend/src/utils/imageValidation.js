// utils/imageValidation.js

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const validateImageUpload = (file) => {
  if (!file) {
    return {
      isValid: false,
      error: 'No file selected',
    };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please upload only JPG, JPEG or PNG files',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'File size should be less than 5MB',
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

export const handleImagePreview = (files, onSuccess, onError) => {
  const file = files[0];

  const validationResult = validateImageUpload(file);

  if (!validationResult.isValid) {
    onError?.(validationResult.error);
    return;
  }

  const fileURL = URL.createObjectURL(file);
  onSuccess?.(fileURL, file);
};

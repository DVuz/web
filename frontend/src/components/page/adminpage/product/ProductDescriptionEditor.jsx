import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ProductDescriptionEditor = ({
  sections: initialSections,
  onChange,
  resetEditor,
}) => {
  const [sections, setSections] = useState(
    initialSections || [
      {
        id: 1,
        titleVi: '',
        titleEn: '',
        contentVi: '',
        contentEn: '',
        images: [],
      },
    ]
  );

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'align',
    'link',
  ];
  useEffect(() => {
    // console.log('Sections updated:', sections);
    onChange?.(sections); // Gọi onChange mỗi khi sections thay đổi
  }, [sections, onChange]);
  // Add effect to handle reset
  useEffect(() => {
    if (resetEditor) {
      // Clean up existing image URLs
      sections.forEach((section) => {
        section.images.forEach((image) => {
          if (image.url.startsWith('data:')) {
            URL.revokeObjectURL(image.url);
          }
        });
      });

      // Reset to initial state with one empty section
      const initialSection = {
        id: 1,
        titleVi: '',
        titleEn: '',
        contentVi: '',
        contentEn: '',
        images: [],
      };

      setSections([initialSection]);

      // Reset all ReactQuill editors
      const quillEditors = document.querySelectorAll('.ql-editor');
      quillEditors.forEach((editor) => {
        editor.innerHTML = '';
      });

      // Reset all input fields
      const inputs = document.querySelectorAll('input[type="text"]');
      inputs.forEach((input) => {
        input.value = '';
      });

      // Reset file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => {
        input.value = '';
      });

      // Notify parent component of the reset
      onChange?.([initialSection]);
      onChange?.(sections);
    }
  }, [resetEditor, onChange]);

  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      {
        id: Date.now(),
        titleVi: '',
        titleEn: '',
        contentVi: '',
        contentEn: '',
        images: [],
      },
    ]);
  };

  const handleImageUpload = async (sectionId, file) => {
    try {
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size must not exceed 2MB');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      const imageUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setSections((prev) =>
        prev.map((section) => {
          if (section.id === sectionId) {
            const newImages = [...section.images];
            if (newImages.length >= 4) {
              throw new Error('Maximum 4 images allowed per section');
            }
            newImages.push({
              url: imageUrl,
              file,
              description: '',
            });
            return { ...section, images: newImages };
          }
          return section;
        })
      );
    } catch (error) {
      console.error('Image upload error:', error);
      alert(error.message);
    }
  };

  const handleImageDelete = (sectionId, imageIndex) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              images: section.images.filter((_, idx) => idx !== imageIndex),
            }
          : section
      )
    );
  };

  return (
    <div className='space-y-8'>
      {sections.map((section) => (
        <div
          key={section.id}
          className='border rounded-lg p-6 space-y-6 bg-white shadow-sm'
        >
          <div className='flex justify-end'>
            <button
              onClick={() =>
                setSections((prev) => prev.filter((s) => s.id !== section.id))
              }
              className='px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 
                         transition-colors duration-200 focus:outline-none focus:ring-2 
                         focus:ring-red-500 focus:ring-offset-2'
            >
              Delete Section
            </button>
          </div>

          <div className='grid gap-6'>
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Title (Vietnamese)
              </label>
              <input
                type='text'
                value={section.titleVi}
                onChange={(e) => {
                  setSections((prev) =>
                    prev.map((s) =>
                      s.id === section.id
                        ? { ...s, titleVi: e.target.value }
                        : s
                    )
                  );
                }}
                className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 
                         focus:border-blue-500 outline-none'
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Title (English)
              </label>
              <input
                type='text'
                value={section.titleEn}
                onChange={(e) => {
                  setSections((prev) =>
                    prev.map((s) =>
                      s.id === section.id
                        ? { ...s, titleEn: e.target.value }
                        : s
                    )
                  );
                }}
                className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 
                         focus:border-blue-500 outline-none'
              />
            </div>
          </div>

          <div className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Content (Vietnamese)
              </label>
              <ReactQuill
                theme='snow'
                value={section.contentVi}
                onChange={(content) => {
                  setSections((prev) =>
                    prev.map((s) =>
                      s.id === section.id ? { ...s, contentVi: content } : s
                    )
                  );
                }}
                modules={modules}
                formats={formats}
                className='h-48 mb-12'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Content (English)
              </label>
              <ReactQuill
                theme='snow'
                value={section.contentEn}
                onChange={(content) => {
                  setSections((prev) =>
                    prev.map((s) =>
                      s.id === section.id ? { ...s, contentEn: content } : s
                    )
                  );
                }}
                modules={modules}
                formats={formats}
                className='h-48 mb-12'
              />
            </div>
          </div>

          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <label className='text-sm font-medium text-gray-700'>
                Images (Maximum 4)
              </label>
              <span className='text-sm text-gray-500'>
                {section.images.length}/4 images
              </span>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {section.images.map((image, index) => (
                <div key={index} className='relative group'>
                  <img
                    src={image.url}
                    alt={image.description}
                    className='w-full h-48 object-cover rounded-lg'
                  />
                  <div
                    className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 
                               transition-all duration-200 rounded-lg'
                  >
                    <button
                      onClick={() => handleImageDelete(section.id, index)}
                      className='absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-lg 
                               hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity 
                               duration-200'
                    >
                      <Trash2 className='w-4 h-4 text-red-500' />
                    </button>
                  </div>
                  <input
                    type='text'
                    value={image.description}
                    onChange={(e) => {
                      setSections((prev) =>
                        prev.map((s) => {
                          if (s.id === section.id) {
                            const newImages = [...s.images];
                            newImages[index] = {
                              ...newImages[index],
                              description: e.target.value,
                            };
                            return { ...s, images: newImages };
                          }
                          return s;
                        })
                      );
                    }}
                    placeholder='Image description'
                    className='mt-2 w-full text-sm p-2 border rounded focus:ring-2 
                             focus:ring-blue-500 focus:border-blue-500 outline-none'
                  />
                </div>
              ))}

              {section.images.length < 4 && (
                <div
                  className='border-2 border-dashed rounded-lg p-4 flex flex-col 
                             items-center justify-center gap-2 hover:bg-gray-50 
                             transition-colors duration-200'
                >
                  <input
                    type='file'
                    id={`image-upload-${section.id}`}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleImageUpload(section.id, e.target.files[0]);
                      }
                    }}
                    accept='image/*'
                    className='hidden'
                  />
                  <label
                    htmlFor={`image-upload-${section.id}`}
                    className='cursor-pointer text-center'
                  >
                    <Plus className='w-8 h-8 mx-auto text-gray-400' />
                    <span className='block text-sm text-gray-600'>
                      Add Image
                    </span>
                    <span className='text-xs text-gray-400'>Max 2MB</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={handleAddSection}
        className='w-full p-3 border-2 border-dashed rounded-lg text-gray-600 
                 hover:border-blue-500 hover:text-blue-500 transition-colors duration-200'
      >
        Add New Section
      </button>
    </div>
  );
};

export default ProductDescriptionEditor;

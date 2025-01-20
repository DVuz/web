import React, { useState } from 'react';
import { LiaFileUploadSolid } from 'react-icons/lia';
import { MdOutlineCloudUpload } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

const Upload = () => {
  const [files, setFiles] = useState([]);
  const { t } = useTranslation('uploadFile');
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const droppedFiles = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files).filter((file) =>
      file.type.startsWith('image/')
    );
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className='p-4'>
      {/* Khu vực kéo thả file */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className='flex flex-col items-center justify-center p-6 text-center border-2 border-gray-300 border-dashed rounded-lg'
      >
        <LiaFileUploadSolid className='w-20 h-20 mb-2 text-green-600' />
        <p>
          {t('dropImage')}
          <span
            className='font-bold text-blue-500 cursor-pointer'
            onClick={() => document.getElementById('fileInput').click()}
          >
            {t('browse')}
          </span>
          <input
            id='fileInput'
            type='file'
            multiple
            onChange={handleFileChange}
            className='hidden'
            accept='image/*' // Chỉ chấp nhận file ảnh
          />
        </p>
        <p>{t('support')}</p>
      </div>

      {/* Hiển thị các file đã chọn */}
      {files.length > 0 && (
        <div className='mt-4 '>
          {files.map((file, index) => (
            <div
              key={index}
              className='flex items-center p-2 mb-2 rounded-lg bg-slate-600'
            >
              {file.type.startsWith('image/') && (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className='object-cover w-20 h-20 p-2 mr-4 rounded-xl'
                />
              )}
              <div className='flex-grow'>
                <p className='text-sm'>{file.name}</p>
                <p className='text-xs text-gray-500'>
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                onClick={() => handleRemoveFile(index)}
                className='ml-4 text-red-500 hover:text-red-700'
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Button chọn file */}
      <button className='mt-4'>
        <label className='flex items-center w-auto px-4 py-2 font-bold text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-700'>
          <MdOutlineCloudUpload className='w-6 h-6 mr-2' />
          {t('uploadFile')}
          <input
            type='file'
            multiple
            onChange={handleFileChange}
            className='hidden'
            accept='image/*' // Chỉ chấp nhận file ảnh
          />
        </label>
      </button>
    </div>
  );
};

export default Upload;

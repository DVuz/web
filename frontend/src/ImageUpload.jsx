import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ uploadCategory, uploadType }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Tạo preview
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
        `https://192.168.0.102:3000/api/upload/${uploadCategory}/${uploadType}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      setMessage('File uploaded successfully!');
      console.log('Uploaded file path:', response.data.filePath);
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file. Please try again.');
    }
  };

  return (
    <div className='file-upload-container h-48 w-48'>
      {/* <h2>Upload a {uploadType.toUpperCase()}</h2> */}
      <input type='file' onChange={handleFileChange} />
      {preview && uploadType === 'img' && (
        <div className='preview-container'>
          <h3>Preview:</h3>
          <img src={preview} alt='Selected' className='preview-image' />
        </div>
      )}
      <button onClick={handleUpload} disabled={!selectedFile}>
        Upload
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;

import React from 'react';
import { MdOutlineCloudDownload } from 'react-icons/md';
import DocxIcon from '../../assets/FileIcon/docx.png';
import PdfIcon from '../../assets/FileIcon/pdf.png';
import PptxIcon from '../../assets/FileIcon/pptx.png';
import XlsxIcon from '../../assets/FileIcon/xlsx.png';
import MusicIcon from '../../assets/FileIcon/music.png';

const FileMessage = ({ fileName, fileSize, fileType, filePath }) => {
  const getFileExtension = (type) => {
    switch (type) {
      case 'application/pdf':
        return 'pdf';
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'docx';
      case 'application/vnd.ms-powerpoint':
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        return 'pptx';
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return 'xlsx';
      case 'audio/mpeg':
      case 'audio/wav':
      case 'audio/ogg':
        return 'music';
      default:
        return type.toLowerCase();
    }
  };

  const getFileIcon = (type) => {
    const extension = getFileExtension(type);
    switch (extension) {
      case 'doc':
      case 'docx':
        return DocxIcon;
      case 'pdf':
        return PdfIcon;
      case 'ppt':
      case 'pptx':
        return PptxIcon;
      case 'xls':
      case 'xlsx':
        return XlsxIcon;
      case 'music':
      case 'mp3':
      case 'wav':
      case 'ogg':
        return MusicIcon;
      default:
        return DocxIcon;
    }
  };

  const truncateFileName = (name) => {
    if (name.length <= 25) return name;

    const extension = name.split('.').pop();
    const nameWithoutExt = name.slice(0, -(extension.length + 1));

    if (nameWithoutExt.length <= 22) return name;

    return `${nameWithoutExt.slice(0, 22)}...${extension ? `.${extension}` : ''}`;
  };

  const handleDownload = async () => {
    try {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = filePath;
      link.download = fileName; // Set the download filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className='flex items-center p-3 space-x-3 bg-white rounded-lg shadow-2xl dark:bg-[#042f2c]'>
      <img
        src={getFileIcon(fileType)}
        alt='File icon'
        className='w-10 h-10 object-contain'
      />

      <div className='flex-1 min-w-0'>
        <p className='text-sm font-medium text-gray-900 truncate dark:text-white'>
          {truncateFileName(fileName)}
        </p>
        <p className='text-sm text-gray-500 dark:text-gray-400'>{fileSize}</p>
      </div>

      <button
        onClick={handleDownload}
        className='p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200'
        title='Download file'
      >
        <MdOutlineCloudDownload className='w-6 h-6' />
      </button>
    </div>
  );
};

export default FileMessage;

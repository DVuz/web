import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AutoResizingTextarea } from '../../common';
import { MdOutlineAttachFile, MdClose } from 'react-icons/md';
import { BiSolidLike } from 'react-icons/bi';
import { IoSendSharp, IoImages } from 'react-icons/io5';
import { useSocket } from '../../../contexts/SocketContext';
import useAuth from '../../../hooks/useAuth';
import { sendMessage } from '../../../services/postApi';
import FileItem from '../../shared/FileMessage';
import NotificationModal from '../NotificationModal';
import AudioRecorder from '../AudioRecorder';
import CustomAudioPlayer from './CustomAudioPlayer';

const TYPING_TIMER_LENGTH = 2000;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 15 * 1024 * 1024; // 15MB
const MAX_DOCUMENT_FILES = 5;
const MAX_MEDIA_FILES = 5;

const ALLOWED_FILE_TYPES = {
  file: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  audio: ['audio/webm', 'audio/mp3', 'audio/wav', 'audio/ogg'],
};

const ChatRoom = ({ receiverEmail, senderId, conversationId, last_message ,accessToken}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentFileType, setCurrentFileType] = useState(null);
  const [notification, setNotification] = useState({
    isOpen: false,
    message: '',
    type: 'error',
  });
  console.log('last_message', last_message);

  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const { socket } = useSocket();
  const { user } = useAuth();

  const showNotification = useCallback((message, type = 'error') => {
    setNotification({ isOpen: true, message, type });
  }, []);

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  };

  const handleAudioRecordingComplete = async (audioBlob) => {
    if (currentFileType && currentFileType !== 'audio') {
      showNotification(
        'Please remove existing files before adding audio recording'
      );
      return;
    }

    try {
      const audioFile = new File([audioBlob], `audio_${Date.now()}.webm`, {
        type: 'audio/webm;codecs=opus',
      });

      const newAudioFile = {
        file: audioFile,
        fileName: audioFile.name,
        fileSize: `${(audioFile.size / 1024).toFixed(2)} KB`,
        fileType: 'audio',
        category: 'audio',
        preview: URL.createObjectURL(audioBlob),
      };

      setSelectedFiles([newAudioFile]);
      setCurrentFileType('audio');
    } catch (error) {
      console.error('Error creating audio file:', error);
      showNotification('Failed to process audio recording');
    }
  };

  const handleAudioError = (error) => {
    showNotification(error);
  };

  const getFileType = (file) => {
    if (ALLOWED_FILE_TYPES.file.includes(file.type)) {
      const extension = file.name.split('.').pop().toLowerCase();
      return { category: 'file', extension };
    }
    if (ALLOWED_FILE_TYPES.image.includes(file.type)) {
      return { category: 'image', extension: 'image' };
    }
    if (ALLOWED_FILE_TYPES.video.includes(file.type)) {
      return { category: 'video', extension: 'video' };
    }
    if (ALLOWED_FILE_TYPES.audio.includes(file.type)) {
      return { category: 'audio', extension: 'audio' };
    }
    return { category: 'unknown', extension: 'unknown' };
  };

  const validateFileCount = (files, newFiles) => {
    if (!newFiles.length) return { valid: true };

    const newFileType = getFileType(newFiles[0]).category;

    // If we already have files of a different type, reject
    if (currentFileType && currentFileType !== newFileType) {
      return {
        valid: false,
        error: `Cannot mix different file types. Please remove existing ${currentFileType} files first.`,
      };
    }

    const totalCount = files.length + newFiles.length;

    if (newFileType === 'file' && totalCount > MAX_DOCUMENT_FILES) {
      return {
        valid: false,
        error: `Maximum ${MAX_DOCUMENT_FILES} file files allowed`,
      };
    }

    if (
      (newFileType === 'image' || newFileType === 'video') &&
      totalCount > MAX_MEDIA_FILES
    ) {
      return {
        valid: false,
        error: `Maximum ${MAX_MEDIA_FILES} ${newFileType} files allowed`,
      };
    }

    return { valid: true };
  };

  const validateFile = (file) => {
    const { category } = getFileType(file);

    if (category === 'unknown') {
      return { valid: false, error: 'Unsupported file type' };
    }

    if (category === 'video' && file.size > MAX_VIDEO_SIZE) {
      return { valid: false, error: 'Video size must be less than 15MB' };
    }

    if (category === 'file' && file.size > MAX_FILE_SIZE) {
      return { valid: false, error: 'File size must be less than 10MB' };
    }

    return { valid: true };
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);

    // First validate if we can add these files
    const countValidation = validateFileCount(selectedFiles, files);
    if (!countValidation.valid) {
      showNotification(countValidation.error);
      resetFileInput();
      return;
    }

    const newFiles = files
      .map((file) => {
        const validation = validateFile(file);
        if (!validation.valid) {
          showNotification(validation.error);
          return null;
        }

        const { category, extension } = getFileType(file);

        return {
          file,
          fileName: file.name,
          fileSize: `${(file.size / 1024).toFixed(2)} KB`,
          fileType: extension,
          category,
          preview: category === 'image' ? URL.createObjectURL(file) : null,
        };
      })
      .filter(Boolean);

    if (newFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      setCurrentFileType(getFileType(files[0]).category);
    }
    resetFileInput();
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles.splice(index, 1);

      // If we removed all files, reset the current file type
      if (newFiles.length === 0) {
        setCurrentFileType(null);
      }

      return newFiles;
    });
    resetFileInput();
  };

  const renderFilePreview = (fileObj, index) => {
    const { category, preview, fileName, fileSize, fileType } = fileObj;

    if (category === 'image') {
      return (
        <div key={index} className='relative inline-block mr-2 mb-2'>
          <img
            src={preview}
            alt={fileName}
            className='h-20 w-20 object-cover rounded'
          />
          <button
            onClick={() => removeFile(index)}
            className='absolute top-0 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors'
          >
            <MdClose />
          </button>
        </div>
      );
    }

    if (category === 'video') {
      return (
        <div key={index} className='relative inline-block mr-2 mb-2'>
          <video className='h-20 w-20 object-cover rounded'>
            <source
              src={URL.createObjectURL(fileObj.file)}
              type={fileObj.file.type}
            />
            Your browser does not support video preview.
          </video>
          <button
            onClick={() => removeFile(index)}
            className='absolute top-0 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors'
          >
            <MdClose />
          </button>
        </div>
      );
    }

    if (category === 'audio') {
      return (
        <div key={index} className='relative inline-block mr-2 mb-2'>
          <div className='h-20'>
            <CustomAudioPlayer src={preview} />
          </div>
          <button
            onClick={() => removeFile(index)}
            className='absolute top-0 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors'
          >
            <MdClose />
          </button>
        </div>
      );
    }

    return (
      <div className='relative inline-block mr-2 mb-2'>
        <FileItem
          fileName={fileName}
          fileSize={fileSize}
          fileType={fileType}
          showDownload={false}
        />
        <button
          onClick={() => removeFile(index)}
          className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors'
        >
          <MdClose />
        </button>
      </div>
    );
  };

  const emitTyping = useCallback(
    (typing) => {
      if (!socket || !user?.decodedToken?.email || !receiverEmail) return;
      socket.emit('typing', {
        senderEmail: user.decodedToken.email,
        receiverEmail,
        isTyping: typing,
      });
    },
    [socket, user, receiverEmail]
  );

  const handleTyping = useCallback(() => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      emitTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      emitTyping(false);
    }, TYPING_TIMER_LENGTH);
  }, [emitTyping]);

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => {
    if (!inputValue.trim() && selectedFiles.length === 0) {
      setIsFocused(false);
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (newValue.trim()) {
      handleTyping();
    } else {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        emitTyping(false);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() && selectedFiles.length === 0) return;

    try {
      const messageData = {
        conversation_id: conversationId,
        sender_id: senderId,
        content: inputValue.trim() || null,
        type: selectedFiles.length > 0 ? selectedFiles[0].category : 'text',
        parent_id: null,
      };

      const result = await sendMessage(
        messageData,
        selectedFiles,
        user.accessToken
      );

      if (socket && result.success) {
        socket.emit('new:message', {
          conversationId,
          senderEmail: user.decodedToken.email,
          receiverEmail,
          message: result.data,
        });
      }

      // Reset the form
      setInputValue('');
      setSelectedFiles((prev) => {
        prev.forEach((file) => {
          if (file.preview) {
            URL.revokeObjectURL(file.preview);
          }
        });
        return [];
      });
      setCurrentFileType(null);
      resetFileInput();

      if (!inputValue.trim()) {
        setIsFocused(false);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      showNotification('Failed to send message. Please try again.');
    }

    // Reset typing status
    if (isTypingRef.current) {
      isTypingRef.current = false;
      emitTyping(false);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTypingRef.current) {
        emitTyping(false);
      }
      selectedFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
      resetFileInput();
    };
  }, [emitTyping, selectedFiles]);

  return (
    <>
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        message={notification.message}
        type={notification.type}
      />

      <div className='flex flex-col space-y-2 p-4 rounded-b-xl border-t-2 border-[#042f2c]'>
        {selectedFiles.length > 0 && (
          <div className='flex flex-wrap max-h-32 overflow-y-auto'>
            {selectedFiles.map((file, index) => renderFilePreview(file, index))}
          </div>
        )}

        <div className='flex items-center space-x-4'>
          {!isFocused && (
            <div className='flex items-center space-x-4'>
              <input
                type='file'
                ref={fileInputRef}
                onChange={handleFileSelect}
                className='hidden'
                multiple
                accept={Object.values(ALLOWED_FILE_TYPES).flat().join(',')}
              />
              <button
                className='text-gray-500 hover:text-mainYellow text-xl hover:scale-125 transition-transform'
                onClick={() => fileInputRef.current?.click()}
                title='Attach file'
                disabled={currentFileType && currentFileType !== 'file'}
              >
                <MdOutlineAttachFile
                  size={28}
                  className={
                    currentFileType && currentFileType !== 'file'
                      ? 'opacity-50'
                      : ''
                  }
                />
              </button>
              <AudioRecorder
                onRecordingComplete={handleAudioRecordingComplete}
                onError={handleAudioError}
                disabled={currentFileType && currentFileType !== 'audio'}
                className={
                  currentFileType && currentFileType !== 'audio'
                    ? 'opacity-50'
                    : ''
                }
              />
              <button
                className='text-gray-500 hover:text-mainYellow text-xl hover:scale-125 transition-transform'
                onClick={() => fileInputRef.current?.click()}
                title='Upload images'
                disabled={
                  currentFileType &&
                  !['image', 'video'].includes(currentFileType)
                }
              >
                <IoImages
                  size={28}
                  className={
                    currentFileType &&
                    !['image', 'video'].includes(currentFileType)
                      ? 'opacity-50'
                      : ''
                  }
                />
              </button>
            </div>
          )}

          <div className='flex-grow'>
            <AutoResizingTextarea
              value={inputValue}
              handleChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder='Type a message...'
            />
          </div>

          <div className='flex items-center space-x-3'>
            {!isFocused && !selectedFiles.length && (
              <button
                className='hover:scale-125 transition-transform'
                title='Quick like'
              >
                <BiSolidLike
                  size={28}
                  className='dark:text-mainYellow text-blue-700'
                />
              </button>
            )}
            {(isFocused || inputValue.trim() || selectedFiles.length > 0) && (
              <button
                className='hover:scale-125 transition-transform text-mainYellow'
                onClick={handleSend}
                title='Send message'
              >
                <IoSendSharp size={28} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatRoom;

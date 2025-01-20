import React, { useState } from 'react';
import MessageSetting from '../shared/Messenger/MessageSetting';
import FileMessage from '../shared/FileMessage';
import CustomAudioPlayer from '../shared/Messenger/CustomAudioPlayer';

// PreviewModal Component remains unchanged
const PreviewModal = ({
  isOpen,
  onClose,
  type,
  files,
  currentIndex,
  setCurrentIndex,
}) => {
  if (!isOpen) return null;

  const handlePrevious = () => {
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : files.length - 1);
  };

  const handleNext = () => {
    setCurrentIndex(currentIndex < files.length - 1 ? currentIndex + 1 : 0);
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75'
      onClick={onClose}
    >
      <div
        className='relative w-full h-full flex items-center justify-center'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className='absolute top-4 right-4 text-white text-xl p-2 hover:bg-gray-800 rounded-full'
          onClick={onClose}
        >
          ✕
        </button>

        {files.length > 1 && (
          <>
            <button
              className='absolute left-4 text-white text-4xl p-2 hover:bg-gray-800 rounded-full'
              onClick={handlePrevious}
            >
              ‹
            </button>
            <button
              className='absolute right-4 text-white text-4xl p-2 hover:bg-gray-800 rounded-full'
              onClick={handleNext}
            >
              ›
            </button>
          </>
        )}

        <div className='max-w-[90%] max-h-[90%]'>
          {type === 'image' ? (
            <img
              src={files[currentIndex]}
              alt={`Preview ${currentIndex + 1}`}
              className='max-w-full max-h-[90vh] object-contain'
            />
          ) : (
            <video
              controls
              autoPlay
              className='max-w-full max-h-[90vh]'
              src={files[currentIndex]}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {files.length > 1 && (
          <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white'>
            {currentIndex + 1} / {files.length}
          </div>
        )}
      </div>
    </div>
  );
};

const Message = ({ message, isLastReadMessage = false }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const isImageContent = message.type === 'image' && message.metadata?.files;
  const isVideoContent = message.type === 'video' && message.metadata?.files;
  const isSoundContent =
    message.type === 'voiceRecord' && message.metadata?.files;
  const isFileContent = message.type === 'file' && message.metadata?.files;
  const hasTextContent = message.content && message.content.trim().length > 0;
  const isYouSender = message.send === 'You';

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getFileUrl = (filePath) => {
    return `${filePath}`;
  };

  const handleMediaClick = (index) => {
    setPreviewIndex(index);
    setPreviewOpen(true);
  };

  const renderImage = (metadata) => {
    const images = metadata.files.map((file) => getFileUrl(file.filePath));

    if (images.length === 1) {
      return (
        <div
          className='w-80 cursor-pointer'
          onClick={() => handleMediaClick(0)}
        >
          <img
            src={images[0]}
            alt={metadata.files[0].originalName}
            className='object-cover w-full rounded-md max-h-80'
          />
        </div>
      );
    }

    const displayCount = Math.min(4, images.length);
    const remainingCount = images.length > 4 ? images.length - 4 : 0;
    const displayImages = images.slice(
      0,
      remainingCount > 0 ? 4 : displayCount
    );

    return (
      <div className='grid grid-cols-2 gap-2'>
        {displayImages.map((img, idx) => (
          <div
            key={idx}
            className={`relative cursor-pointer ${
              idx === 0 && displayImages.length === 3 ? 'col-span-2' : ''
            }`}
            onClick={() => handleMediaClick(idx)}
          >
            <img
              src={img}
              alt={metadata.files[idx].originalName}
              className={`object-cover rounded-xl ${
                idx === 0 && displayImages.length === 3
                  ? 'w-full h-full'
                  : 'w-32 h-32'
              }`}
            />
            {idx === 3 && remainingCount > 0 && (
              <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl'>
                <span className='text-xl font-bold text-white'>
                  +{remainingCount}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderVideo = (metadata) => {
    const videos = metadata.files.map((file) => getFileUrl(file.filePath));

    if (videos.length === 1) {
      return (
        <div
          className='w-80 cursor-pointer'
          onClick={() => handleMediaClick(0)}
        >
          <video
            className='object-cover w-full rounded-md max-h-80'
            src={videos[0]}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    const displayCount = Math.min(4, videos.length);
    const remainingCount = videos.length > 4 ? videos.length - 3 : 0;
    const displayVideos = videos.slice(
      0,
      remainingCount > 0 ? 3 : displayCount
    );

    return (
      <div className='grid grid-cols-2 gap-1'>
        {displayVideos.map((video, idx) => (
          <div
            key={idx}
            className={`relative cursor-pointer ${
              idx === 0 && displayVideos.length === 3 ? 'col-span-2' : ''
            }`}
            onClick={() => handleMediaClick(idx)}
          >
            <video
              className={`object-cover rounded-xl ${
                idx === 0 && displayVideos.length === 3
                  ? 'w-full h-full'
                  : 'w-32 h-32'
              }`}
              src={video}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
        {remainingCount > 0 && (
          <div
            className='relative w-32 h-32 cursor-pointer'
            onClick={() => handleMediaClick(3)}
          >
            <video
              src={videos[3]}
              className='object-cover w-full h-full rounded-md brightness-50'
            />
            <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl'>
              <span className='text-xl font-bold text-white'>
                +{remainingCount}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFile = (metadata) => {
    const file = metadata.files[0];
    return (
      <FileMessage
        fileName={file.originalName}
        fileSize={`${Math.round(file.size / 1024)}KB`}
        fileType={file.mimeType}
        filePath={getFileUrl(file.filePath)}
      />
    );
  };

  const renderContent = () => {
    return (
      <div className='flex flex-col gap-2'>
        {/* Media content */}
        {isImageContent && (
          <div className='mb-2'>{renderImage(message.metadata)}</div>
        )}
        {isVideoContent && (
          <div className='mb-2'>{renderVideo(message.metadata)}</div>
        )}
        {isFileContent && (
          <div className='mb-2'>{renderFile(message.metadata)}</div>
        )}
        {isSoundContent && (
          <div className='mb-2'>
            <CustomAudioPlayer
              src={getFileUrl(message.metadata.files[0].filePath)}
            />
          </div>
        )}

        {/* Text content */}
        {hasTextContent && (
          <div className='text-gray-700 dark:text-white break-words'>
            {message.content}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className='group'>
        <div className='relative flex flex-col max-w-lg p-3 mt-3 bg-gray-200 rounded-3xl shadow-md cursor-pointer dark:bg-[#042f2c]'>
          {renderContent()}

          <div
            className={`absolute top-0 p-2 transition-opacity duration-300 opacity-0 ${
              isYouSender ? '-left-16' : '-right-16'
            } group-hover:opacity-100`}
          >
            <MessageSetting sender={message.sender} />
          </div>
        </div>

        <div className='justify-self-end text-xs p-1 italic font-bold text-gray-500 transition-opacity duration-300 hidden group-hover:flex items-center'>
          <div className='flex items-center'>
            <span>Sent at: {formatDateTime(message.datetime)}</span>
          </div>

          {isYouSender && isLastReadMessage && (
            <div className='flex items-center'>
              <img
                src={message.sender.avatar_link}
                alt='Read'
                className='inline-block w-3 h-3 ml-1 rounded-full'
              />
              <span className='ml-1'>
                Read at: {formatDateTime(message.readtime)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {(isImageContent || isVideoContent) && (
        <PreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          type={message.type}
          files={message.metadata.files.map((file) =>
            getFileUrl(file.filePath)
          )}
          currentIndex={previewIndex}
          setCurrentIndex={setPreviewIndex}
        />
      )}
    </>
  );
};

export default Message;

import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone } from 'react-icons/fa';

const MIN_RECORDING_TIME = 1000; // 1 second in milliseconds
const MAX_RECORDING_TIME = 600; // 10 minutes in seconds

const AudioRecorder = ({ onRecordingComplete, onError }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showRecordingUI, setShowRecordingUI] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const recordingStartTimeRef = useRef(null);
  const audioChunksRef = useRef([]); // Store chunks in a ref instead of state

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      audioChunksRef.current = []; // Reset chunks at start

      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      setMediaRecorder(recorder);
      setRecordingDuration(0);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data); // Add chunks to ref
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm;codecs=opus',
        });

        if (audioBlob.size === 0) {
          onError?.('Failed to record audio');
          return;
        }

        onRecordingComplete?.(audioBlob);
        cleanupRecording();
      };

      recorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setShowRecordingUI(true);
      recordingStartTimeRef.current = Date.now();

      let startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        setRecordingDuration(elapsedTime);

        if (elapsedTime >= MAX_RECORDING_TIME) {
          stopRecording();
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      onError?.(
        error.message === 'Permission denied'
          ? 'Please allow microphone access to record'
          : 'Could not start recording. Please try again.'
      );
    }
  };

  const cleanupRecording = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setMediaRecorder(null);
    audioChunksRef.current = []; // Clear chunks
    setRecordingDuration(0);
    setIsRecording(false);
    setShowRecordingUI(false);
  };

  const stopRecording = () => {
    if (mediaRecorder?.state === 'recording') {
      const currentDuration = Date.now() - recordingStartTimeRef.current;

      if (currentDuration < MIN_RECORDING_TIME) {
        onError?.('Recording too short. Please record for at least 1 second.');
        cleanupRecording();
        return;
      }

      mediaRecorder.stop();
    }
  };

  useEffect(() => {
    return () => {
      cleanupRecording();
    };
  }, []);

  const timeRemaining = MAX_RECORDING_TIME - Math.floor(recordingDuration);
  const showTimeRemaining = timeRemaining <= 10;

  return (
    <div className='flex items-center space-x-2'>
      {!showRecordingUI && (
        <button
          onClick={startRecording}
          className='text-gray-500 hover:text-mainYellow text-xl hover:scale-125 transition-transform'
          title='Start recording'
        >
          <FaMicrophone size={28} />
        </button>
      )}

      {showRecordingUI && (
        <div className='flex items-center space-x-2 bg-red-100 rounded-full px-4 py-2'>
          <div className='w-3 h-3 bg-red-500 rounded-full animate-pulse' />
          <span className='text-red-500 font-medium'>
            {formatTime(recordingDuration)}
            {showTimeRemaining && ` (${timeRemaining}s left)`}
          </span>
          <button
            onClick={stopRecording}
            className='text-red-500 hover:text-red-700 transition-colors ml-2'
          >
            Stop
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;

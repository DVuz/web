import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';

const CustomAudioPlayer = ({ src }) => {
  const waveformRef = useRef(null);
  const waveSurferInstance = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVolume, setShowVolume] = useState(false);

  useEffect(() => {
    waveSurferInstance.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#ddd',
      progressColor: '#28a745',
      barWidth: 2,
      height: 30,
      responsive: true,
    });

    waveSurferInstance.current.load(src);

    waveSurferInstance.current.on('audioprocess', () => {
      setCurrentTime(waveSurferInstance.current.getCurrentTime());
    });

    waveSurferInstance.current.on('ready', () => {
      setDuration(waveSurferInstance.current.getDuration());
    });

    waveSurferInstance.current.on('play', () => setIsPlaying(true));
    waveSurferInstance.current.on('pause', () => setIsPlaying(false));

    return () => {
      waveSurferInstance.current.destroy();
    };
  }, [src]);

  const togglePlay = () => {
    if (waveSurferInstance.current) {
      waveSurferInstance.current.playPause();
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (waveSurferInstance.current) {
      waveSurferInstance.current.setVolume(newVolume);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className='flex flex-col items-center p-4 rounded-lg shadow-md w-80'>
      <div className='flex items-center w-full'>
        <button
          onClick={togglePlay}
          className='text-green-500 hover:text-green-600 text-2xl mr-4'
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        <div ref={waveformRef} className='flex-grow'></div>

        <div className='ml-4 text-gray-600'>
          <span>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div
          className='relative flex items-center ml-4'
          onMouseEnter={() => setShowVolume(true)}
          onMouseLeave={() => setShowVolume(false)}
        >
          <FaVolumeUp className='text-gray-500 text-xl mr-2' />
          {showVolume && (
            <input
              type='range'
              min='0'
              max='1'
              step='0.01'
              value={volume}
              onChange={handleVolumeChange}
              className='absolute right-4 w-24 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer transform scale-x-[-1] transition-all duration-300 ease-in-out'
              aria-label='Volume control'
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomAudioPlayer;

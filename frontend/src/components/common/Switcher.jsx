// Switcher.js
import React, { useState } from 'react';

const Switcher = () => {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    setIsOn(!isOn);
  };

  return (
    <div className='flex items-center space-x-4'>
      <div
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
          isOn ? 'bg-green-500' : 'bg-slate-500'
        }`}
        onClick={toggleSwitch}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
            isOn ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </div>
    </div>
  );
};

export default Switcher;

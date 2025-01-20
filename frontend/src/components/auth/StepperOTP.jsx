import React from 'react';

const Stepper = ({ currentStep }) => {
  const stepClass = (step) => {
    if (step < currentStep) {
      return 'text-green-600 dark:text-green-500 font-bold';
    } else if (step === currentStep) {
      return 'text-green-600 dark:text-green-500 font-bold';
    } else {
      return 'text-gray-500 dark:text-gray-400';
    }
  };

  const renderIcon = (step) => {
    if (step < currentStep) {
      return (
        <svg
          className='w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z' />
        </svg>
      );
    } else {
      return <span className='me-2'>{step}</span>;
    }
  };

  const renderMobileSteps = () => {
    const steps = [1, 2, 3];

    return steps.map((step) => (
      <span key={step} className={`flex items-center mx-2 ${stepClass(step)}`}>
        {renderIcon(step)}
      </span>
    ));
  };

  const renderCurrentLabel = () => {
    const labels = ['Forgot Password', 'OTP Validation', 'New Password'];
    return (
      <span className='text-sm font-medium text-center text-gray-500 dark:text-gray-400 mt-2 lg:hidden'>
        {labels[currentStep - 1]}
      </span>
    );
  };

  return (
    <ol className='flex flex-col lg:flex-row items-center w-full text-sm font-medium text-center sm:text-base'>
      {/* Desktop View */}
      <li className='hidden lg:flex md:w-full items-center after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:mx-6 xl:after:mx-10 dark:after:border-gray-700'>
        <span className={`flex items-center ${stepClass(1)}`}>
          {renderIcon(1)}
          <span className='whitespace-nowrap ms-2'>
            Forgot
            <span className='hidden sm:inline-flex sm:ms-2'>Password</span>
          </span>
        </span>
      </li>
      <li className='hidden lg:flex md:w-full items-center after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:mx-6 xl:after:mx-10 dark:after:border-gray-700'>
        <span className={`flex items-center ${stepClass(2)}`}>
          {renderIcon(2)}
          <span className='whitespace-nowrap ms-2'>
            OTP
            <span className='hidden sm:inline-flex sm:ms-2'>Validation</span>
          </span>
        </span>
      </li>
      <li className='hidden lg:flex items-center'>
        <span className={`flex items-center ${stepClass(3)}`}>
          {renderIcon(3)}
          <span className='whitespace-nowrap ms-2'>New Password</span>
        </span>
      </li>

      {/* Mobile View */}
      <div className='flex lg:hidden justify-center w-full'>
        {renderMobileSteps()}
      </div>
      {renderCurrentLabel()}
    </ol>
  );
};

export default Stepper;

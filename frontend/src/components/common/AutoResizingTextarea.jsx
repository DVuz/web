import { useEffect, useRef, useState } from 'react';

const AutoResizingTextarea = ({
  value,
  handleChange,
  onFocus,
  onBlur,
  disabled,
}) => {
  const textareaRef = useRef(null);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    // Adjust the height of textarea based on its content
    const adjustHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height
        const lineHeight = parseFloat(
          getComputedStyle(textareaRef.current).lineHeight
        );
        const maxHeight = lineHeight * 5; // 5 lines maximum

        // Check if content exceeds max height to show/hide scrollbar
        const shouldShowScroll = textareaRef.current.scrollHeight > maxHeight;
        setShowScroll(shouldShowScroll);

        const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
        textareaRef.current.style.height = `${Math.max(lineHeight, newHeight)}px`; // At least 1 line height
      }
    };

    // Adjust height on input change
    adjustHeight();

    // Add event listener to adjust height on input
    if (textareaRef.current) {
      textareaRef.current.addEventListener('input', adjustHeight);
    }

    // Cleanup event listener when component unmounts
    return () => {
      if (textareaRef.current) {
        textareaRef.current.removeEventListener('input', adjustHeight);
      }
    };
  }, [value]); // Re-run when value changes

  return (
    <textarea
      ref={textareaRef}
      id='floating_outlined'
      className='block px-2.5 pb-2.5 pt-4 w-full text-md text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-6800 peer'
      value={value}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      rows={1} // Start with 1 row
      style={{
        resize: 'none', // Disable manual resizing
        maxHeight: 'calc(5 * 1.5em)', // Max height of 5 lines
        minHeight: '1.5em', // Min height of 1 line
        overflowY: showScroll ? 'auto' : 'hidden', // Only show scrollbar when content exceeds 5 lines
      }}
    />
  );
};

export default AutoResizingTextarea;

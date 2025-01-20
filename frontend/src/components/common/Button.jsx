import PropTypes from 'prop-types';

const Button = ({
  context,
  onClick,
  color = 'green',
  Icon,
  disabled = false,
}) => {
  // Đặt các lớp CSS dựa trên giá trị của biến `color`
  const colorClasses =
    color === 'red'
      ? 'bg-white text-red-600 border border-red-600 hover:bg-red-50 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80'
      : 'bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80';

  return (
    <div>
      <button
        type='button'
        className={`w-full ${colorClasses} font-bold rounded-lg text-lg px-5 py-2.5 text-center me-2 mb-2 flex items-center justify-center ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={onClick}
        disabled={disabled}
      >
        {Icon && <Icon className='mr-2' />} {/* Hiển thị icon nếu có */}
        {context}
      </button>
    </div>
  );
};

// Define prop types
Button.propTypes = {
  context: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  color: PropTypes.string, // `color` có thể là 'red' hoặc 'green'
  Icon: PropTypes.elementType, // `Icon` là một component icon, không bắt buộc
  disabled: PropTypes.bool, // `disabled` để quản lý trạng thái của nút
};

export default Button;

export const numberToVietnameseWords = (number) => {
  const units = [
    '',
    'một',
    'hai',
    'ba',
    'bốn',
    'năm',
    'sáu',
    'bảy',
    'tám',
    'chín',
  ];
  const positions = ['', 'mươi', 'trăm'];
  const scales = ['', 'nghìn', 'triệu', 'tỷ'];

  if (number === 0) return 'không';
  if (number === 10) return 'mười';

  const formatGroup = (group) => {
    const digits = group.split('').map(Number);
    let result = '';

    // Handle hundreds position
    if (digits[0] !== 0) {
      result += units[digits[0]] + ' trăm ';
    }

    // Handle tens position
    if (digits[1] !== 0) {
      if (digits[1] === 1) {
        result += 'mười ';
      } else {
        result += units[digits[1]] + ' mươi ';
      }
    } else if (digits[0] !== 0 && digits[2] !== 0) {
      result += 'linh ';
    }

    // Handle ones position
    if (digits[2] !== 0) {
      if (digits[1] !== 0 && digits[2] === 1) {
        result += 'mốt';
      } else if (digits[2] === 5 && digits[1] !== 0) {
        result += 'lăm';
      } else {
        result += units[digits[2]];
      }
    }

    return result.trim();
  };

  const numberStr = Math.floor(number).toString();
  const groups = [];

  // Split number into groups of 3 digits
  for (let i = numberStr.length; i > 0; i -= 3) {
    groups.unshift(numberStr.slice(Math.max(0, i - 3), i).padStart(3, '0'));
  }

  let result = '';
  groups.forEach((group, index) => {
    const groupValue = parseInt(group);
    if (groupValue !== 0) {
      const groupText = formatGroup(group);
      if (groupText) {
        result += groupText + ' ' + scales[groups.length - 1 - index] + ' ';
      }
    }
  });

  result = result.trim();
  return result.charAt(0).toUpperCase() + result.slice(1) + ' đồng';
};

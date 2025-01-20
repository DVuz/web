// Hàm chuyển đổi thời gian thành phút
const convertToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Hàm nhóm tin nhắn và tạo thông tin chi tiết
const processMessageDetails = (messages) => {
  // Sắp xếp tin nhắn theo thời gian từ mới đến cũ
  const sortedMessages = [...messages].sort(
    (a, b) => convertToMinutes(b.timestamp) - convertToMinutes(a.timestamp)
  );

  const groupedDetails = [];
  let currentGroup = [];

  for (let i = 0; i < sortedMessages.length; i++) {
    const currentMessage = {
      ...sortedMessages[i],
      messageId: `msg_${i + 1}`, // Thêm ID cho mỗi tin nhắn
      groupIndex: groupedDetails.length, // Thêm chỉ số nhóm
    };

    if (i === 0) {
      currentGroup.push(currentMessage);
      continue;
    }

    const previousMessage = sortedMessages[i - 1];
    const timeDiff = Math.abs(
      convertToMinutes(currentMessage.timestamp) -
        convertToMinutes(previousMessage.timestamp)
    );

    if (timeDiff > 3) {
      groupedDetails.push({
        groupId: `group_${groupedDetails.length + 1}`,
        messages: [...currentGroup],
        startTime: currentGroup[0].timestamp,
        endTime: currentGroup[currentGroup.length - 1].timestamp,
        messageCount: currentGroup.length,
      });
      currentGroup = [];
    }

    currentGroup.push(currentMessage);
  }

  // Thêm nhóm cuối cùng
  if (currentGroup.length > 0) {
    groupedDetails.push({
      groupId: `group_${groupedDetails.length + 1}`,
      messages: [...currentGroup],
      startTime: currentGroup[0].timestamp,
      endTime: currentGroup[currentGroup.length - 1].timestamp,
      messageCount: currentGroup.length,
    });
  }

  return groupedDetails;
};

// Dữ liệu mẫu
const messages = [
  {
    content: [
      'https://192.168.0.102:3000/api/media/avatars/qaz.jpg',
      'https://192.168.0.102:3000/api/media/avatars/qaz.jpg',
      'https://192.168.0.102:3000/api/media/avatars/qaz.jpg',
      'https://192.168.0.102:3000/api/media/avatars/qaz.jpg',
    ],
    timestamp: '13:20',
    type: 'img',
  },
  {
    content:
      'Chào bạn, mình có thể giúp gif cho bạn được không nhỉ? Tôi là Trần Ánh Dương',
    timestamp: '12:30',
    type: 'text',
  },
  {
    content: 'Rất xin chào bạn',
    timestamp: '12:29',
    type: 'text',
  },
  {
    content: 'Tin nhắn này khá dài và gần với tin nhắn trước',
    timestamp: '11:34',
    type: 'text',
  },
  {
    content: 'Tin nhắn cuối cùng của nhóm này',
    timestamp: '11:33',
    type: 'text',
  },
  {
    content: 'Tin nhắn thuộc nhóm mới',
    timestamp: '11:30',
    type: 'text',
  },
];

// Xử lý và hiển thị kết quả
const messageDetails = processMessageDetails(messages);

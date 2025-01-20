import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import GroupCall from './GroupCall';
import PersonalCall from './PersonalCall';

const VideoCallPage = () => {
  const { roomId } = useParams();

  // Kiểm tra loại cuộc gọi
  if (roomId.startsWith('group_')) {
    return <GroupCall roomId={roomId} />;
  } else if (roomId.startsWith('p2p_')) {
    return <PersonalCall roomId={roomId} />;
  }

  // Nếu roomId không hợp lệ
  return <Navigate to='/404' replace />;
};

export default VideoCallPage;

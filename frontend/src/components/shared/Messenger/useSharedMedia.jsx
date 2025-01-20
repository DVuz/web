import { useState, useEffect, useCallback } from 'react';
import { getMediaByType } from '../../../services/getApi';

export const useSharedMedia = (conversationId, mediaType, accessToken) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastMessageId, setLastMessageId] = useState(null);

  // Process media items into the format expected by the UI
  const processMediaData = (mediaData) => {
    return mediaData.flatMap((message) =>
      message.files.map((file) => ({
        url: file.url,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type,
        message_id: message.message_id,
        sent_at: message.sent_at,
        sender: message.sender,
        // Additional video-specific properties
        ...(mediaType === 'video' && {
          thumbnail: file.thumbnail || file.url,
          duration: file.duration || '0:00',
        }),
      }))
    );
  };

  // Fetch initial media data
  const fetchInitialMedia = useCallback(async () => {
    if (!conversationId || !mediaType || !accessToken) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getMediaByType(
        conversationId,
        mediaType,
        accessToken
      );

      const processedMedia = processMediaData(response.media);
      setMedia(processedMedia);
      setHasMore(response.pagination.has_more);

      if (response.media.length > 0) {
        setLastMessageId(response.media[response.media.length - 1].message_id);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId, mediaType, accessToken]);

  // Load more media items
  const loadMore = async () => {
    if (loading || !hasMore || !lastMessageId) return;

    try {
      setLoading(true);

      const response = await getMediaByType(
        conversationId,
        mediaType,
        accessToken,
        {
          last_message_id: lastMessageId,
        }
      );

      const processedMedia = processMediaData(response.media);
      setMedia((prevMedia) => [...prevMedia, ...processedMedia]);
      setHasMore(response.pagination.has_more);

      if (response.media.length > 0) {
        setLastMessageId(response.media[response.media.length - 1].message_id);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading more media:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount and when dependencies change
  useEffect(() => {
    fetchInitialMedia();
  }, [fetchInitialMedia]);

  return {
    media,
    loading,
    error,
    hasMore,
    loadMore,
    refreshMedia: fetchInitialMedia,
  };
};

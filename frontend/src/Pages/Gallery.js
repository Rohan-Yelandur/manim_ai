import React, { useState, useEffect } from 'react';
import VideoCard from '../Components/VideoCard';
import './Gallery.css';

const Gallery = ({ supabase, session, videos, setVideos, hasFetched, setHasFetched }) => {
  // videos state is now lifted to App.js
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(!hasFetched); // Only load if not fetched

  useEffect(() => {
    const fetchVideos = async () => {
      if (!session) {
        setLoading(false);
        return;
      }

      // If already fetched, don't fetch again
      if (hasFetched) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching videos:', error);
      } else {
        const videoData = data || [];

        // Optimization: Batch fetch signed URLs
        if (videoData.length > 0) {
          const validPaths = videoData.map(v => v.video_path).filter(Boolean);
          if (validPaths.length > 0) {
            const { data: signedData, error: signedError } = await supabase.storage
              .from('Lesson Videos')
              .createSignedUrls(validPaths, 3600); // 1 hour validity

            if (signedError) {
              console.error('Error batch fetching signed URLs:', signedError);
            } else if (signedData) {
              // Create a map for quick lookup: path -> signedUrl
              const urlMap = {};
              signedData.forEach(item => {
                if (item.path && item.signedUrl) {
                  urlMap[item.path] = item.signedUrl;
                }
              });

              // Enrich videos with signedUrl
              videoData.forEach(video => {
                if (video.video_path && urlMap[video.video_path]) {
                  video.signedUrl = urlMap[video.video_path];
                }
              });
            }
          }
        }

        setVideos(videoData);
        setHasFetched(true);
      }
      setLoading(false);
    };

    fetchVideos();
  }, [supabase, session, hasFetched, setHasFetched, setVideos]);

  const filteredVideos = videos.filter(video => {
    const term = searchTerm.toLowerCase();
    const titleMatch = video.title.toLowerCase().includes(term);
    const tagsMatch = video.tags && video.tags.toLowerCase().includes(term);
    return titleMatch || tagsMatch;
  });

  return (
    <div className="gallery">
      <div className="gallery-header">
        <h1>My Math Gallery</h1>
        <p>Your personal collection of AI-generated visualizations</p>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by title or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="gallery-grid">
        {loading ? (
          <div className="loading-state">Loading your collection...</div>
        ) : filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} supabase={supabase} />
          ))
        ) : (
          <div className="empty-state">
            {searchTerm ? 'No videos found match your search.' : !session ? 'Please login to view your saved videos.' : 'You haven\'t saved any videos yet.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
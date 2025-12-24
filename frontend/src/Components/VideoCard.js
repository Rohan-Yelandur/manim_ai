import React, { useState, useEffect } from 'react';

const VideoCard = ({ video, supabase }) => {
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    const fetchSignedUrl = async () => { // Make the inner function async
      if (video.video_path) {
        const { data, error } = await supabase.storage
          .from('Lesson Videos')
          .createSignedUrl(video.video_path, 3600); // Valid for 1 hour

        if (error) {
          console.error('Error creating signed URL:', error);
        } else if (data) {
          setVideoUrl(data.signedUrl);
        }
      }
    };

    fetchSignedUrl(); // Call the async function
  }, [video, supabase]);

  const tagsArray = video.tags ? video.tags.split(',').map(tag => tag.trim()) : [];

  return (
    <div className="gallery-card glass-panel">
      <div className="gallery-video-container">
        {videoUrl ? (
          <video controls preload="metadata" className="gallery-video">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="gallery-image-placeholder">Loading Video...</div>
        )}
      </div>
      <div className="gallery-content">
        <h3 title={video.title}>{video.title}</h3>
        <div className="tags-container">
          {tagsArray.map((tag, index) => (
            <span key={index} className="tag-pill">{tag}</span>
          ))}
        </div>
        {/* <button className="gallery-btn">View Details</button> */}
      </div>
    </div>
  );
};

export default VideoCard;

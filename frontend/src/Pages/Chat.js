import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chat.css';
import { FaArrowUp, FaPlus } from 'react-icons/fa';


const Chat = ({
  supabase,
  session,
  videoBlob,
  setVideoBlob,
  videos,
  setVideos,
  loading,
  elapsedTime,
  query,
  setQuery,
  onGenerate
}) => {
  // removed local blob state, using props
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'; // Max height constraint logic in CSS mostly, but logic here helps
    }
  }, [query]);

  const [saved, setSaved] = useState(false);

  // Reset saved state when loading starts (controlled by parent loading prop now effectively)
  useEffect(() => {
    if (loading) {
      setSaved(false);
    }
  }, [loading]);

  const getLoadingStatus = (seconds) => {
    if (seconds >= 50) return "Adding Finishing Touches";
    if (seconds >= 40) return "Syncing Video and Audio";
    if (seconds >= 30) return "Rendering Video";
    if (seconds >= 20) return "Creating Animations";
    if (seconds >= 10) return "Generating Audio";
    return "Writing Script";
  };

  const getProgressPercentage = (seconds) => {
    // fast initial progress, then slower as it gets higher
    // cap at 95% until complete
    const progress = Math.min(seconds * 1.6, 95);
    return progress;
  };

  const handleSaveVideo = async () => {
    if (!videoBlob || !title || !session) return;
    setSaving(true);
    try {
      const user_id = session.user.id;
      const fileName = `${Date.now()}_${title.replace(/\s+/g, '_')}.mp4`;
      const filePath = `${user_id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('Lesson Videos')
        .upload(filePath, videoBlob, {
          contentType: 'video/mp4'
        });

      if (uploadError) throw uploadError;

      const { data: insertedVideo, error: dbError } = await supabase
        .from('videos')
        .insert({
          user_id,
          title,
          tags,
          video_path: filePath
        })
        .select()
        .single(); // Get the inserted row

      if (dbError) throw dbError;

      // Optimistically add to global state so Gallery doesn't need to refetch
      if (insertedVideo) {
        // Fetch signed URL for the new video immediately
        const { data: signedData } = await supabase.storage
          .from('Lesson Videos')
          .createSignedUrl(filePath, 3600);

        if (signedData && signedData.signedUrl) {
          insertedVideo.signedUrl = signedData.signedUrl;
        }

        setVideos([insertedVideo, ...videos]);
      }

      // alert('Video saved successfully!'); // Removed alert in favor of UI change
      setSaved(true);
      setTitle('');
      setTags('');
      // setVideoBlob(null); // REMOVED: Keep video persistent
    } catch (error) {
      console.error('Error saving video:', error);
      alert(`Failed to save video: ${error.message || error.error_description || JSON.stringify(error)}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="chat-container">
      {loading && (
        <div className="loading-container">
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${getProgressPercentage(elapsedTime)}%` }}
            ></div>
          </div>
          <p className="loading-text">{getLoadingStatus(elapsedTime)}...</p>
        </div>
      )}
      {videoBlob && (
        <div className="video-preview">
          <video controls className="preview-player">
            <source src={URL.createObjectURL(videoBlob)} />
          </video>
          {session ? (
            <div className="save-controls">
              <input
                type="text"
                placeholder="Video Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <button
                onClick={handleSaveVideo}
                disabled={saving || saved}
                className={saved ? 'saved-btn' : saving ? 'saving-btn' : ''}
                style={saved ? { backgroundColor: '#10B981', cursor: 'default' } : {}}
              >
                {saving ? 'Saving...' : saved ? '✓ Saved to Gallery' : 'Save to Gallery'}
              </button>
            </div>
          ) : (
            <div className="save-controls">
              <p className="login-message">Please log in to save this video to your gallery.</p>
              <button onClick={() => navigate('/login')} className="login-btn-small">Go to Login</button>
            </div>
          )}
        </div>
      )}

      <div className="input-wrapper">
        <button className="icon-btn add-btn" aria-label="Add attachment">
          <FaPlus />
        </button>
        <textarea
          ref={textareaRef}
          className="chat-input"
          placeholder="Ask a math question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onGenerate();
            }
          }}
          disabled={loading}
          rows={1}
        />
        <button
          className="icon-btn send-btn"
          onClick={onGenerate}
          disabled={loading || !query.trim()}
          aria-label="Generate Video"
        >
          <FaArrowUp />
        </button>
      </div>
    </div>
  );
};

export default Chat;
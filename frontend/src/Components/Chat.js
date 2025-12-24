import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chat.css';


const Chat = ({ supabase, session, videoBlob, setVideoBlob, videos, setVideos }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  // removed local blob state, using props
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const [saved, setSaved] = useState(false);

  const handleGenerateVideo = async () => {
    try {
      setLoading(true);
      setSaved(false); // Reset saved state on new generation
      const response = await fetch('http://localhost:8000/create-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      if (response.ok) {
        setVideoBlob(await response.blob());
      }
    } catch (error) {
      console.error('Error from handleGenerateVideo', error)
    } finally {
      setLoading(false);
    }
  }

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
      <input
        type="text"
        placeholder="Enter question here"
        value={query}
        onChange={(e) => { setQuery(e.target.value) }}
      />
      <button onClick={handleGenerateVideo} disabled={loading}>
        {loading ? 'Generating Video...' : 'Click to Generate'}
      </button>
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
    </div>
  );
};

export default Chat;
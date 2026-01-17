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
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [query]);

  const [saved, setSaved] = useState(false);

  // Reset saved state when loading starts
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
    const progress = Math.min(seconds * 1.6, 95);
    return progress;
  };

  // User subscription state
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);

  // Fetch user data on session change
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('users')
          .select('subscription_active, monthly_video_count, total_video_count')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user limits:', error);
        } else {
          setSubscriptionActive(data?.subscription_active || false);
          setMonthlyCount(data?.monthly_video_count || 0);
          setTotalCount(data?.total_video_count || 0);
        }
      }
    };
    fetchUserData();
  }, [session, supabase]);

  const handleGenerateClick = () => {
    if (!session) {
      setShowLoginPrompt(true);
      return;
    }

    // Check limits: If not Pro (subscription_active) and total count >= 1
    if (!subscriptionActive && totalCount >= 1) {
      setShowLimitModal(true);
      return;
    }

    setShowLoginPrompt(false);
    onGenerate();
  };

  // ... existing handleSaveVideo ...

  // ... inside return ...
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
          video_path: filePath,
          prompt: query
        })
        .select()
        .single(); // Get the inserted row

      if (dbError) throw dbError;

      // Update user video counts
      const { data: userData, error: userFetchError } = await supabase
        .from('users')
        .select('total_video_count, monthly_video_count, subscription_start_date')
        .eq('id', user_id)
        .single();

      if (userFetchError) {
        console.error('Error fetching user data:', userFetchError);
      } else {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        let newMonthlyCount = (userData?.monthly_video_count || 0) + 1;

        // Check if we need to reset monthly count (new month)
        if (userData?.subscription_start_date) {
          const startDate = new Date(userData.subscription_start_date);
          const startMonth = startDate.getMonth();
          const startYear = startDate.getFullYear();

          // Reset if it's a different month or year
          if (currentMonth !== startMonth || currentYear !== startYear) {
            newMonthlyCount = 1;
            // Update subscription_start_date to current month
            await supabase
              .from('users')
              .update({ subscription_start_date: currentDate.toISOString() })
              .eq('id', user_id);
          }
        }

        // Update both counts
        const { error: updateError } = await supabase
          .from('users')
          .update({
            total_video_count: (userData?.total_video_count || 0) + 1,
            monthly_video_count: newMonthlyCount
          })
          .eq('id', user_id);

        if (updateError) {
          console.error('Error updating user counts:', updateError);
        }
      }

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
          {session ? (
            <>
              <video controls className="preview-player">
                <source src={URL.createObjectURL(videoBlob)} />
              </video>
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
            </>
          ) : (
            <div className="login-required-message">
              <h3>Login Required</h3>
              <p>You must be logged in to watch your generated video.</p>
              <button onClick={() => navigate('/login')} className="login-btn-primary">
                Go to Login
              </button>
            </div>
          )}
        </div>
      )}

      {showLoginPrompt && (
        <div className="login-prompt-toast">
          <p>
            ⚠️ Please{' '}
            <button onClick={() => navigate('/login')} className="toast-login-btn">
              log in
            </button>{' '}
            to generate videos
          </p>
        </div>
      )}

      {/* Limit Reached Modal */}
      {showLimitModal && (
        <div className="modal-overlay">
          <div className="limit-modal">
            <button className="close-modal-btn" onClick={() => setShowLimitModal(false)}>×</button>
            <div className="limit-icon">🔒</div>
            <h3>Limit Reached</h3>
            <p>
              You've used your 1 free video.
              Upgrade to Pro to generate up to 50 videos per month!
            </p>
            <button onClick={() => navigate('/get-pro')} className="upgrade-btn">
              Upgrade to Pro
            </button>
            <button onClick={() => setShowLimitModal(false)} className="maybe-later-btn">
              Maybe Later
            </button>
          </div>
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
              handleGenerateClick();
            }
          }}
          disabled={loading}
          rows={1}
        />
        <button
          className="icon-btn send-btn"
          onClick={handleGenerateClick}
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
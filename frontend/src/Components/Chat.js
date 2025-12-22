import React, { useState } from 'react';
import './Chat.css';

const Chat = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [blob, setBlob] = useState(null);

  const handleGenerateVideo = async() => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/create-video', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({query})
      })
      if (response.ok) {
        setBlob(await response.blob());
      }
    } catch (error) {
      console.error('Error from handleGenerateVideo', error)
    } finally {
      setLoading(false);
    }
  }

  return (
      <div className="chat-container">
          <input 
            type="text"
            placeholder="enter question here"
            value={query}
            onChange={(e) => {setQuery(e.target.value)}}
          />
          <button onClick={handleGenerateVideo}>
            {loading ? 'Generating Video...' : 'Click to Generate'}
          </button>
          {blob && (
            <video controls>
              <source src={URL.createObjectURL(blob)}/>
            </video>
          )}
      </div>
  );
};

export default Chat;
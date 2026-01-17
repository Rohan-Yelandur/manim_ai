import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Home from './Pages/Home';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Gallery from './Pages/Gallery';
import Chat from './Pages/Chat';
import GetPro from './Pages/GetPro';
import './App.css';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY
);

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoBlob, setVideoBlob] = useState(null);
  const [videos, setVideos] = useState([]);
  const [hasFetchedVideos, setHasFetchedVideos] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let interval;
    if (isGenerating) {
      setElapsedTime(0);
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerateVideo = async () => {
    // Don't generate video if user is not logged in
    if (!session) {
      console.log('User not logged in, skipping video generation');
      return;
    }

    try {
      setIsGenerating(true);
      setVideoBlob(null); // Clear previous video
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
      setIsGenerating(false);
      setElapsedTime(0);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setVideos([]);
      setHasFetchedVideos(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <Header user={session?.user} onSignOut={() => supabase.auth.signOut()} />

      <Routes>
        <Route
          path="/login"
          element={<Login supabase={supabase} />}
        />
        <Route
          path="/signup"
          element={<Signup supabase={supabase} />}
        />
        <Route
          path="/"
          element={<Home session={session} />}
        />
        <Route
          path="/chat"
          element={
            <Chat
              supabase={supabase}
              session={session}
              videoBlob={videoBlob}
              setVideoBlob={setVideoBlob}
              videos={videos}
              setVideos={setVideos}
              loading={isGenerating}
              elapsedTime={elapsedTime}
              query={query}
              setQuery={setQuery}
              onGenerate={handleGenerateVideo}
            />
          }
        />
        <Route
          path="/gallery"
          element={
            <Gallery
              supabase={supabase}
              session={session}
              videos={videos}
              setVideos={setVideos}
              hasFetched={hasFetchedVideos}
              setHasFetched={setHasFetchedVideos}
            />
          }
        />
        <Route
          path="/get-pro"
          element={<GetPro />}
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
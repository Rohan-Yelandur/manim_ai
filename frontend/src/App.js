import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Home from './Pages/Home';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Gallery from './Pages/Gallery';
import './App.css';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY
);

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
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
          element={<Home supabase={supabase} />}
        />
        <Route
          path="/gallery"
          element={<Gallery supabase={supabase} />}
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Gallery from './Pages/Gallery';
import './App.css';

function App() {
  return (
    <div className="app">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>

        <Footer />
    </div>
  );
}

export default App;
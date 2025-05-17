import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Donation from './pages/Donation';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Chauvihar from './pages/QuickLinks/Chauvihar';
import Shetrunjay from './pages/QuickLinks/Shetrunjay';
import Giriraj from './pages/QuickLinks/Giriraj';
import Palkhi from './pages/QuickLinks/Palkhi';
import Guru from './pages/QuickLinks/Guru';
import Shasan from './pages/QuickLinks/Shasan';
import Sadharmik from './pages/QuickLinks/Sadharmik';
import Anukampa from './pages/QuickLinks/Anukampa';
import Jivdaya from './pages/QuickLinks/Jivdaya';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* All main routes go inside Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="donation" element={<Donation />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
          <Route path="quicklinks/chauvihar" element={<Chauvihar />} />
          <Route path="quicklinks/shetrunjay" element={<Shetrunjay />} />
          <Route path="quicklinks/giriraj" element={<Giriraj />} />
          <Route path="quicklinks/palkhi" element={<Palkhi />} />
          <Route path="quicklinks/guru" element={<Guru />} />
          <Route path="quicklinks/shasan" element={<Shasan />} />
          <Route path="quicklinks/sadharmik" element={<Sadharmik />} />
          <Route path="quicklinks/anukampa" element={<Anukampa />} />
          <Route path="quicklinks/jivdaya" element={<Jivdaya />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);

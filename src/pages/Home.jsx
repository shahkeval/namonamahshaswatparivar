import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './Home.css'; // Create a new CSS file for styling
import Footer from '../components/Footer'; // Import the Footer component
import Breadcrumb from '../components/Breadcrumb';

const images = [
  '/images/bapji.jpg',
  '/images/bhadra.jpg',
  '/images/guru.jpg',
  '/images/guru2.jpg',
];

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <>
    <div className="home-container">
      
      <div className="image-section">
        <img src={images[currentImageIndex]} alt="Description" />
      </div>
      <div className="text-section">
        <h1>નમો નમઃ શાશ્વત પરિવાર</h1>
        <h3> યૌવન એટલે શું? વીજળીનો તણખો, <br />
          જો ઝબકે તો અજવાળુ, નહિંતર ભડકો.. <br /></h3>
        <p>
         
          સ્વાર્થી દુનિયાની વચ્ચે રહી નિ:સ્વાર્થતાના મીઠડા ઘુંટ પીવા અને પીવડાવવા માટે દુર્લભ મનુષ્યભવને પ્રત્યેક ક્ષણે ચિરંજીવ બનાવી દેવા માટે પરમાત્મા મહાવીર સ્વામી કથિત શાશ્વત સુખનું લક્ષ અને આત્માના પક્ષને નજર સમક્ષ રાખી ક્ષણે ક્ષણને જીવંત બનાવવા માટે જેઓ સતત પ્રયત્નશીલ છે, જેઓ હંમેશા શાસનને સમર્પિત છે, એવા સત્ત્વશાળી યુવાનોની મજબુત સાંકળ એટલે<b> નમો નમઃ શાશ્વત પરિવાર.</b>
        </p>
      </div>
      <div className="quick-links">
        <h2>Quick Links</h2>
        <ul>
          <li><Link to="/quicklinks/chauvihar">Chauvihar Chhath kari Giriraj 7 Yatra</Link></li>
          <li><Link to="/quicklinks/shetrunjay">Shetrunjay Nadi Nahi Ne Anusthan</Link></li>
          <li><Link to="/quicklinks/giriraj">Giriraj Nav-tunk Pratimaji Ashtprakari Puja</Link></li>
          <li><Link to="/quicklinks/palkhi">Palkhi Yatra</Link></li>
          <li><Link to="/quicklinks/guru">Guru Bhagwant Vaiyavach</Link></li>
          <li><Link to="/quicklinks/shasan">Shasan Prabhavna</Link></li>
          <li><Link to="/quicklinks/sadharmik">Sadharmik Bhakti</Link></li>
          <li><Link to="/quicklinks/anukampa">Anukampa</Link></li>
          <li><Link to="/quicklinks/jivdaya">Jivdaya</Link></li>
          <li>& more</li>
        </ul>
      </div>
    </div>
    <div>
              <Footer /> {/* Add the Footer component here */}

    </div>
    </>
  );
};

export default Home;

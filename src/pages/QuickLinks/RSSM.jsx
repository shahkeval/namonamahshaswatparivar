import React, { useState } from 'react';
import './RSSM.css';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const upcomingEvents = [
  {
    id: 1,
    title: 'RSSM Giri Seva - 2025',
    date: '2025-06-13,14,15',
    location: 'Palitana',
    image: '/images/event1.jpg',
    description: 'ગિરિ સેવા એ એવી સેવા પ્રવૃત્તિ છે, જ્યાં ભક્તો ભેગા થઈને શત્રુંજય પર્વત પર મંદિરો અને મુર્તિઓની સફાઈ કરે છે. આ કાર્ય માત્ર શારીરિક સેવા નથી, પરંતુ આત્માની શુદ્ધિનો માર્ગ પણ છે. પવિત્ર તીર્થની સંભાળ લેવી એ દરેક તીર્થયાત્રીનું કર્તવ્ય છે. આપ પણ, ભક્તિ અને સેવા સાથે, આ યાત્રામાં સહભાગી થાઓ.',
    type: 'upcoming',
  },
  // Add more upcoming events as needed
];

const pastEvents = [
  {
    id: 2,
    title: 'RSSM Past Seva - 2024',
    date: '2024-05-10,11',
    location: 'Palitana',
    image: '/images/event2.jpg',
    description: 'પાછલા વર્ષની સેવા સફળતાપૂર્વક સંપન્ન થઈ હતી. અનેક ભક્તોએ ઉત્સાહપૂર્વક ભાગ લીધો હતો અને તીર્થની સુંદરતા વધારી હતી.',
    type: 'past',
  },
  // Add more past events as needed
];

const RSSM = () => {
  const [activeType, setActiveType] = useState('upcoming');
  const eventsToShow = activeType === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <>
      <div className="events-container">
        <div className="events-header">
          <h1 style={{ marginTop: '0px' }}>Rushabh Samrajya Sanskar Mission</h1>
          
        </div>
        <div className="video-container">
          <iframe
            width="100%"
            height="500"
            src="https://www.youtube.com/embed/S4Nv-6wEXI8"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <h1 style={{ marginTop: '0px' , textAlign:"center"}}>Explore Our Events</h1>
        <p>Join us at our upcoming events or explore our past gatherings</p>
        <div className="events-tabs">
          <button
            className={`tab-button ${activeType === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveType('upcoming')}
          >
            Upcoming Events
          </button>
          <button
            className={`tab-button ${activeType === 'past' ? 'active' : ''}`}
            onClick={() => setActiveType('past')}
          >
            Past Events
          </button>
        </div>
        <div className="events-grid">
          {eventsToShow.length ? (
            eventsToShow.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-card-image">
                  <img src={event.image} alt={event.title} loading="lazy" />
                  {event.type === 'upcoming' && (
                    <div className="event-badge">Upcoming</div>
                  )}
                  {event.type === 'past' && (
                    <div className="event-badge past">Past</div>
                  )}
                </div>
                <div className="event-card-content">
                  <h3>{event.title}</h3>
                  <div className="event-meta">
                    <div className="meta-item">
                      <DateRangeIcon />
                      <p>{event.date}</p>
                    </div>
                    {event.location && (
                      <div className="meta-item">
                        <LocationOnIcon />
                        <p>{event.location}</p>
                      </div>
                    )}
                  </div>
                  <p className="event-description-text" style={{ textAlign: 'justify' }}>
                    {event.description}
                  </p>
                  <button className="view-details-btn">View Details</button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-events">
              <h3>No events found</h3>
              <p>There are currently no events scheduled. Please check back after some time.🙏</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RSSM;

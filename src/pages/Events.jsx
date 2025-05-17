import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import events from '../data/events';
import EventCard from '../components/EventCard';
import './Events.css';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';

const Events = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [activeType, setActiveType] = useState(params.get('type') || 'upcoming');

  const filteredEvents = events.filter(event => event.type === activeType);

  const handleTypeChange = (type) => {
    setActiveType(type);
  };

  return (
    <>
    <div className="events-container">
      <div className="events-header">
        <h1 style={{marginTop: "0px"}}>Our Events</h1>
        <p>Join us at our upcoming events or explore our past gatherings</p>
      </div>

      <div className="events-tabs">
        <button 
          className={`tab-button ${activeType === 'upcoming' ? 'active' : ''}`}
          onClick={() => handleTypeChange('upcoming')}
        >
          Upcoming Events
        </button>
        <button 
          className={`tab-button ${activeType === 'past' ? 'active' : ''}`}
          onClick={() => handleTypeChange('past')}
        >
          Past Events
        </button>
      </div>

      <div className="events-grid">
        {filteredEvents.length ? (
          filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <div className="no-events">
            <h3>No events found</h3>
            <p>There are currently no {activeType} events scheduled. Please check back later.</p>
          </div>
        )}
      </div>

      {/* {activeType === 'upcoming' && filteredEvents.length > 0 && (
        <div className="events-cta">
          <h3>Want to participate in our events?</h3>
          <p>Click on any event to learn more and register</p>
        </div>
      )} */}
      
    </div>
    <Footer/>
    </>
  );
};

export default Events;
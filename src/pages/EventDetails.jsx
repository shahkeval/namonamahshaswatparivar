import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import events from '../data/events';
import './EventDetails.css';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import PeopleIcon from '@mui/icons-material/People';
import { QRCodeSVG } from 'qrcode.react';
import Footer from '../components/Footer';
import emailjs from "emailjs-com"; // Import EmailJS

const EventDetails = () => {
  const { id } = useParams();
  const event = events.find(e => e.id === id);
  
  // Separate state for donation form
  const [donationFormData, setDonationFormData] = useState({
    name: '',
    email: '',
    category:event.title,
    phone: '',
    message: '',
    amount: '',
  });
  
  // Separate state for registration form
  const [registrationFormData, setRegistrationFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmittingDonation, setIsSubmittingDonation] = useState(false);
  const [isSubmittingRegistration, setIsSubmittingRegistration] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [timer, setTimer] = useState(10); // Timer for QR code expiration
  const [error, setError] = useState('');
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Format as MM:SS
  };

  useEffect(() => {
    if (timer > 0 && qrData) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setQrData(null); // Close QR code section
      setError('QR Code has expired. Please resubmit the form.');
      setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
    }
  }, [timer, qrData]);

  if (!event) {
    return (
      <div className="event-not-found">
        <h2>Event Not Found</h2>
        <p>The event you're looking for doesn't exist or has been removed.</p>
        <Link to="/events" className="back-to-events">Back to Events</Link>
      </div>
    );
  }

  const handleDonationChange = (e) => {
    const { name, value } = e.target;
    setDonationFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    setRegistrationFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDonationSubmit = (e) => {
    e.preventDefault();
    setIsSubmittingDonation(true);
    emailjs
    .sendForm(
      "service_264rxjp",
      "template_7oremm9",
      e.target, // Sends form data to the template
      "7vYFlUx2o5N3Cv3Ll"
    )

    const qrString = `upi://pay?pa=namonamahshashwatcha.62486048@hdfcbank&pn=${donationFormData.fullName}&am=${donationFormData.amount}&cu=INR&tn=${donationFormData.message}`;
    setQrData(qrString);
    setTimer(300); // Reset timer on new submission
    setIsSubmittingDonation(false);
    setDonationFormData({
      name: '',
      email: '',
      category:event.title,
      phone: '',
      message: '',
      amount: '',
    });
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    setIsSubmittingRegistration(true);
    emailjs
    .sendForm(
      "service_k2tcpcx",
      "template_u2l34q6",
      e.target, // Sends form data to the template
      "Mc-t84_MrpngejBH_"
    )
    // Handle registration logic here
    // Reset registration form data after submission
    setRegistrationFormData({
      fullName: '',
      email: '',
      phone: '',
      message: '',
    });
    
    setIsSubmittingRegistration(false);
    setSubmitSuccess(true); // Set success message
    setShowThankYouMessage(true); // Show thank you message

    // Set a timer to reset the form after 5 seconds
    setTimeout(() => {
      setShowThankYouMessage(false); // Hide thank you message
      setSubmitSuccess(false); // Reset success state
    }, 5000);
  };

  const toggleDonationForm = () => {
    setShowDonationForm(!showDonationForm);
  };

  const handleBack = () => {
    setShowDonationForm(false);
    setQrData(null);
    setError('');
  };

  return (
    <>
    <div className="event-details-container">
      <div className="breadcrumb">
        <Link to="/events">Events</Link> / <span>{event.title}</span>
      </div>

      <div className="event-details-content">
        <div className="event-info">
          <div className="event-header">
            <h1>{event.title}</h1>
          </div>

          <div className="event-image-container">
            <img src={event.image} alt={event.title} className="event-feature-image fit-image" />
          </div>

          <div className="event-meta-info">
            <div className="meta-item">
              <DateRangeIcon />
              <div>
                <h4>Date & Time</h4>
                <p>{event.date}</p>
                {event.time && <p>{event.time}</p>}
              </div>
            </div>

            {event.location && (
              <div className="meta-item">
                <LocationPinIcon />
                <div>
                  <h4>Location</h4>
                  <p>{event.location}</p>
                </div>
              </div>
            )}

            {event.organizer && (
              <div className="meta-item">
                <PeopleIcon />
                <div>
                  <h4>Organizer</h4>
                  <p>{event.organizer}</p>
                </div>
              </div>
            )}
          </div>

          <div className="event-description-full">
            <h2>About This Event</h2>
            <p className="event-description-text" style={{textAlign:'left'}}>
              {event.description.split('\\n').map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
            {event.schedule && (
              <div className="event-schedule">
                <h3>Event Schedule</h3>
                <ul>
                  {event.schedule.map((item, index) => (
                    <li key={index}>
                      <span className="schedule-time">{item.time}</span>
                      <span className="schedule-activity">{item.activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
  {/* Donation Button */}
  <button className="donation-button" onClick={toggleDonationForm}>
            Donation
          </button>

          {/* Donation Form */}
          {showDonationForm && (
            <div className="donation-form-wrapper">
              <h2>Donation Form</h2>
              <form onSubmit={handleDonationSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={donationFormData.name}
                 onChange={handleDonationChange}
                  required
                />
                <input
                  type="text"
                  name="category"
                  value={donationFormData.category}
                  
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={donationFormData.phone}
                  onChange={handleDonationChange}
                  required
                />
                <input
                  type="text"
                  name="amount"
                  placeholder="Amount"
                  value={donationFormData.amount}
                  onChange={handleDonationChange}
                  required
                />
                <textarea
                  name="message"
                  placeholder="Message (optional)"
                  value={donationFormData.message}
                  onChange={handleDonationChange}
                />
                <button type="submit" disabled={isSubmittingDonation}>
                  {isSubmittingDonation ? 'Submitting...' : 'Submit'}
                </button>
              </form>
              {error && <p className="error-message">{error}</p>}
              {qrData && (
                <div className="qr-section">
                  <p>Scan the QR code below to complete your donation:</p>
                  <QRCodeSVG value={qrData} size={256} />
                  <p>QR Code expires in: {formatTime(timer)}</p>
                  <button className="back-button" onClick={handleBack}>Back</button>
                </div>
              )}
            </div>
          )}
          {event.images && event.images.length > 0 && (
            <div className="event-gallery">
              <h3>Event Gallery</h3>
              <div className="gallery-grid">
                {event.images.map((img, index) => (
                  <div key={index} className="gallery-item">
                    <img src={img} alt={`${event.title} - image ${index + 1}`} className="fit-image" />
                  </div>
                ))}
              </div>
            </div>
          )}

        
        </div>

        <div className="registration-container">
          <div className="registration-child">
            {event.type === 'upcoming' ? (
              <div className="registration-form-wrapper">
                <h2>Register for this Event</h2>
                {showThankYouMessage ? (
                  <div className="success-message">
                    <i className="icon-check"></i>
                    <h3>Thank You!</h3>
                    <p>Your registration has been submitted successfully. We will contact you with more details soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleRegistrationSubmit}>
                    <div className="form-group">
                    <input
                        type="text"
                        id="pagename"
                        name="pagename"
                        placeholder="Enter your full name"
                        className='d-none'
                        value={event.title}
                        onChange={handleRegistrationChange}
                        required
                      />
                      <label htmlFor="fullName">Full Name*</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={registrationFormData.fullName}
                        onChange={handleRegistrationChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address*</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={registrationFormData.email}
                        onChange={handleRegistrationChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Phone Number*</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={registrationFormData.phone}
                        onChange={handleRegistrationChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Additional Message</label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="Any specific requirements or questions..."
                        rows="4"
                        style={{maxWidth:"316px"}}
                        value={registrationFormData.message}
                        onChange={handleRegistrationChange}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={isSubmittingRegistration}
                    >
                      {isSubmittingRegistration ? 'Submitting...' : 'Register Now'}
                    </button>
                  </form>
                )}

                <div className="contact-info">
                  <p>For inquiries, please contact us:</p>
                  <a href="tel:9426364451">+91 9426364451</a>
                  <a href="mailto:namonamahshaswatparivar9@gmail.com">namonamahshaswatparivar9@gmail.com</a>
                </div>
              </div>
            ) : (
              <div className="event-info-message">
                <h2>For This Event</h2>
                <p>For more information or inquiries, join our WhatsApp group!</p>
                <img src="/images/qrcode.png" alt="Join our WhatsApp group" className="qr-code" />
                <div className='join-button-div'>
                  <button 
                    className="join-button" 
                    onClick={() => window.open("https://chat.whatsapp.com/DdNY8vdh03K0cPouuBZupT", "_blank")}
                  >
                    Join With Link
                  </button>
                </div>
              </div>
            )}

            {event.type === 'upcoming' && (
              <div className="event-highlights">
                <h3>Event Highlights</h3>
                <ul>
                  <li>Interactive sessions with experts</li>
                  <li>Networking opportunities</li>
                  <li>Refreshments and snacks provided</li>
                  <li>Certificate of participation</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="related-events">
        {events.filter(e => e.id !== event.id && e.type === event.type).length > 0 && (
          <>
            <h2>Similar Events</h2>
            <div className="related-events-grid">
              {events
                .filter(e => e.id !== event.id && e.type === event.type)
                .slice(0, 3)
                .map(relatedEvent => (
                  <div key={relatedEvent.id} className="related-event-card">
                    <Link to={`/events/${relatedEvent.id}`}>
                      <img src={relatedEvent.image} alt={relatedEvent.title} className="fit-image" />
                      <div className="related-event-info">
                        <h4>{relatedEvent.title}</h4>
                        <p>{relatedEvent.date}</p>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default EventDetails;

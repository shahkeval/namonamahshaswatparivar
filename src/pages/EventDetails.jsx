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
import axios from 'axios';

const EventDetails = () => {
  const { id } = useParams();
  const event = events.find(e => e.id === id);

  // Separate state for donation form
  const [donationFormData, setDonationFormData] = useState({
    name: '',
    email: '',
    category: event.title,
    phone: '',
    message: '',
    amount: '',
  });

  // Separate state for custom registration form
  const [customRegistrationData, setCustomRegistrationData] = useState({
    fullName: '',
    city: '',
    area: '',
    birthdate: '',
    gender: '',
    profession: '',
    whatsapp: '',
    sangh: '',
    category: '',
  });

  // Separate state for default registration form
  const [defaultRegistrationData, setDefaultRegistrationData] = useState({
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
  const [formType, setFormType] = useState('default'); // 'custom' or 'default'

  const [yatraRegistrationData, setYatraRegistrationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    progress: 0,
  });

  const [currentStep, setCurrentStep] = useState(1);

  const [yatrikPhotoPreview, setYatrikPhotoPreview] = useState(null);

  const [email, setEmail] = useState('');
  const [education, setEducation] = useState('');
  const [religiousEducation, setReligiousEducation] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Load states and cities data
  const states = require('../data/IN-states.json');
  const cities = require('../data/IN-cities.json');

  // Filter cities based on selected state
  const filteredCities = cities.filter(city => city.stateCode === selectedState);

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

  const handleCustomRegistrationChange = (e) => {
    const { name, value } = e.target;
    setCustomRegistrationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDefaultRegistrationChange = (e) => {
    const { name, value } = e.target;
    setDefaultRegistrationData(prev => ({
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
      category: event.title,
      phone: '',
      message: '',
      amount: '',
    });
  };

  const handleCustomRegistrationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingRegistration(true);
    try {
      await axios.post('https://namonamahshaswatparivar-dt17.vercel.app/api/rssmsu', customRegistrationData);
      // Reset form data
      setCustomRegistrationData({
        fullName: '',
        city: '',
        area: '',
        birthdate: '',
        gender: '',
        profession: '',
        whatsapp: '',
        sangh: '',
        category: '',
      });
      setShowThankYouMessage(true);
      setFormType('custom'); // Set form type to custom
    } catch (err) {
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmittingRegistration(false);
    }
  };

  const handleDefaultRegistrationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingRegistration(true);
    try {
      await emailjs.sendForm("service_k2tcpcx", "template_u2l34q6", e.target, "Mc-t84_MrpngejBH_");
      // Reset default form data
      setDefaultRegistrationData({
        fullName: '',
        email: '',
        phone: '',
        message: '',
      });
      setShowThankYouMessage(true);
      setFormType('default'); // Set form type to default
    } catch (err) {
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmittingRegistration(false);
    }
  };

  const handleSubmitAnotherForm = () => {
    setShowThankYouMessage(false); // Hide thank you message
    // Reset form data if needed
    // Optionally, you can also reset the form fields here
  };

  const toggleDonationForm = () => {
    setShowDonationForm(!showDonationForm);
  };

  const handleBack = () => {
    setShowDonationForm(false);
    setQrData(null);
    setError('');
  };

  const handleYatraRegistrationChange = (e) => {
    const { name, value } = e.target;
    setYatraRegistrationData(prev => ({ ...prev, [name]: value }));
  };

  const handleYatraRegistrationSubmit = (e) => {
    e.preventDefault();
    // Handle submission logic here
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
    setYatraRegistrationData(prev => ({ ...prev, progress: prev.progress + 25 }));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setYatraRegistrationData(prev => ({ ...prev, progress: prev.progress - 25 }));
  };

  // Deadline for RSSM-સુલેખન કળા registration
  const isSulekhDeadlinePassed = new Date() > sulekhDeadline;

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
                  <p style={{ textAlign: 'start' }}>{event.date}</p>
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
              <p className="event-description-text" style={{ textAlign: 'left' }}>
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
            {/* <button className="donation-button" onClick={toggleDonationForm}>
            Donation
          </button> */}

            {/* Donation Form */}
            {/* {showDonationForm && (
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
          )} */}

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
              {showThankYouMessage ? (
                <div className="success-message">
                  <i className="icon-check"></i>
                  <h3>Thank You!</h3>
                  <p>Your registration has been submitted successfully. We will contact you with more details soon.</p>
                  <button onClick={handleSubmitAnotherForm} className="submit-another-form-btn">
                    Submit Another Form
                  </button>
                </div>
              ) : (
                <>
                  {event.id === 'RSSM-સુલેખન કળા' ? (
                    <>
                     
                      {isSulekhDeadlinePassed ? (
                        <div className="registration-closed-message" style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          background: '#fff8e1', border: '1px solid #ffe082', borderRadius: '16px', padding: '32px 16px', margin: '32px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                        }}>
                          <h3 style={{ color: '#b71c1c', marginBottom: 12, fontWeight: 700, fontSize: '2rem', textAlign: 'center' }}>Registration Closed</h3>
                          <p style={{ color: '#333', fontSize: '1.1rem', textAlign: 'center', marginBottom: 12, maxWidth: 400 }}>
                            Thank you for your interest!<br/>
                            Registration for this event is now closed.<br/>
                            <span style={{ color: '#075e54', fontWeight: 600 }}>Want updates on our next events?</span><br/>
                            Join our WhatsApp group below to stay informed and connected.
                          </p>
                          <p style={{ color: '#333', fontSize: '1.1rem', textAlign: 'center', marginBottom: 24, maxWidth: 400, fontFamily: 'Noto Sans Gujarati, Arial, sans-serif' }}>
                            તમારી રુચિ બદલ આભાર!<br/>
                            આ કાર્યક્રમ માટે નોંધણી હવે બંધ છે.<br/>
                            <span style={{ color: '#075e54', fontWeight: 600 }}>શું તમે અમારી આગામી કાર્યક્રમો વિશે અપડેટ્સ મેળવવા માંગો છો?</span><br/>
                            માહિતી અને સંપર્કમાં રહેવા માટે નીચે આપેલા અમારા WhatsApp ગ્રુપમાં જોડાઓ.
                          </p>
                          <a href="https://chat.whatsapp.com/J2jj56NdGw4LUD4WYkRkVt" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
                            <QRCodeSVG value="https://chat.whatsapp.com/J2jj56NdGw4LUD4WYkRkVt" size={160} style={{ border: '4px solid #25d366', borderRadius: 12, background: '#fff', cursor: 'pointer', marginBottom: 8, transition: 'box-shadow 0.2s', boxShadow: '0 2px 8px rgba(37,211,102,0.15)' }} />
                            <span style={{ color: '#075e54', fontWeight: 600, fontSize: '1rem', marginTop: 4, textAlign: 'center' }}>Tap QR or click here to join WhatsApp group</span>
                          </a>
                        </div>
                      ) : (
                        <form onSubmit={handleCustomRegistrationSubmit}>
                         <div className="rules-note">
                        <p>For rules and regulations:- <br></br><button className="rules-button" onClick={() => window.open('https://docs.google.com/document/d/1-XkmbqGijcaajrGBQVT-NH8UigUnG1Z89T_2Wp1HxkQ/edit?usp=sharing', '_blank')}>click here</button></p>
                      </div>
                          <div className="form-group">
                            <label htmlFor="fullName">Full Name*</label>
                            <input
                              type="text"
                              id="fullName"
                              name="fullName"
                              placeholder="Enter your full name"
                              value={customRegistrationData.fullName}
                              onChange={(e) => setCustomRegistrationData({ ...customRegistrationData, fullName: e.target.value })}
                              required
                            />
                          </div>
                          <br></br>
                          <div className="form-group">
                            <label htmlFor="city">City*</label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              placeholder="Enter your city"
                              value={customRegistrationData.city || ''}
                              onChange={(e) => setCustomRegistrationData({ ...customRegistrationData, city: e.target.value })}
                              required
                            />
                          </div>
                          <br></br>
                          <div className="form-group">
                            <label htmlFor="area">Area*</label>
                            <input
                              type="text"
                              id="area"
                              name="area"
                              placeholder="Enter your area"
                              value={customRegistrationData.area || ''}
                              onChange={(e) => setCustomRegistrationData({ ...customRegistrationData, area: e.target.value })}
                              required
                            />
                          </div>
                          <br></br>
                          <div className="form-group">
                            <label htmlFor="birthdate">Birth date*</label>
                            <input
                              type="date"
                              id="birthdate"
                              name="birthdate"
                              value={customRegistrationData.birthdate || ''}
                              onChange={(e) => setCustomRegistrationData({ ...customRegistrationData, birthdate: e.target.value })}
                              required
                            />
                          </div>
                          <br></br>
                          <div className="form-group">
                            <label htmlFor="gender">Gender*</label>
                            <div>
                              <label>
                                <input
                                  type="radio"
                                  name="gender"
                                  value="Male"
                                  checked={customRegistrationData.gender === 'Male'}
                                  onChange={(e) => setCustomRegistrationData({ ...customRegistrationData, gender: e.target.value })}
                                  required
                                />
                                Male
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  name="gender"
                                  value="Female"
                                  checked={customRegistrationData.gender === 'Female'}
                                  onChange={(e) => setCustomRegistrationData({ ...customRegistrationData, gender: e.target.value })}
                                  required
                                />
                                Female
                              </label>
                            </div>
                          </div>
                          <br></br>
                          <div className="form-group">
                            <label htmlFor="profession">Profession*</label>
                            <input
                              type="text"
                              id="profession"
                              name="profession"
                              placeholder="Enter your profession"
                              value={customRegistrationData.profession || ''}
                              onChange={(e) => setCustomRegistrationData({ ...customRegistrationData, profession: e.target.value })}
                              required
                            />
                          </div>
                          <br></br>
                          <div className="form-group">
                            <label htmlFor="whatsapp">Whatsapp number*</label>
                            <input
                              type="tel"
                              id="whatsapp"
                              name="whatsapp"
                              placeholder="Enter your Whatsapp number"
                              value={customRegistrationData.whatsapp || ''}
                              onChange={(e) => setCustomRegistrationData({ ...customRegistrationData, whatsapp: e.target.value })}
                              required
                            />
                          </div>
                          <br></br>
                          <div className="form-group">
                            <label htmlFor="sangh">Sangh name*</label>
                            <input
                              type="text"
                              id="sangh"
                              name="sangh"
                              placeholder="Enter your Sangh name"
                              value={customRegistrationData.sangh || ''}
                              onChange={(e) => setCustomRegistrationData({ ...customRegistrationData, sangh: e.target.value })}
                              required
                            />
                          </div>
                          <br></br>
                          <div className="form-group">
                            <label htmlFor="category">Category*</label>
                            <select
                              id="category"
                              name="category"
                              value={customRegistrationData.category || ''}
                              onChange={(e) => setCustomRegistrationData({ ...customRegistrationData, category: e.target.value })}
                              required
                            >
                              <option value="">Select Category</option>
                              <option value="6-12 yrs">Category 1: 6-12 yrs</option>
                              <option value="12-18 yrs">Category 2: 12-18 yrs</option>
                              <option value="18-30 yrs">Category 3: 18-30 yrs</option>
                              <option value="30-45 yrs">Category 4: 30-45 yrs</option>
                              <option value="45+ yrs">Category 5: 45+ yrs</option>
                            </select>
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
                    </>
                  ) : (
                    <>
                      {event.id === '7-YATRA-2025' ? (
                        <div>
                            <h2>Yatra Registration</h2>
                            <div className="progress-bar">
                                <div className="progress" style={{ width: `${yatraRegistrationData.progress}%` }}></div>
                            </div>
                            {currentStep === 1 && (
                                <form onSubmit={nextStep}>
                                    <div className="form-group">
                                        <label htmlFor="yatrikPhoto">Yatrik Profile Photo*</label>
                                        <input type="file" id="yatrikPhoto" name="yatrikPhoto" accept="image/*" onChange={(e) => {
                                            setYatraRegistrationData({...yatraRegistrationData, yatrikPhoto: e.target.files[0]});
                                            setYatrikPhotoPreview(URL.createObjectURL(e.target.files[0]));
                                        }} required />
                                    </div>
                                    {yatrikPhotoPreview && <img src={yatrikPhotoPreview} alt="Yatrik Preview" style={{ width: '100px', height: '100px', marginTop: '10px' }} />}
                                    <div className="form-group">
                                        <label htmlFor="yatrikName">Yatrik Name*</label>
                                        <input type="text" id="yatrikName" name="yatrikName" value={yatraRegistrationData.yatrikName} onChange={(e) => setYatraRegistrationData({...yatraRegistrationData, yatrikName: e.target.value})} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="mobileNumber">Mobile Number*</label>
                                        <input type="tel" id="mobileNumber" name="mobileNumber" value={yatraRegistrationData.mobileNumber} onChange={(e) => setYatraRegistrationData({...yatraRegistrationData, mobileNumber: e.target.value})} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="whatsappNumber">WhatsApp Number*</label>
                                        <input type="tel" id="whatsappNumber" name="whatsappNumber" value={yatraRegistrationData.whatsappNumber} onChange={(e) => setYatraRegistrationData({...yatraRegistrationData, whatsappNumber: e.target.value})} required />
                                    </div>
                                    <button type="submit" className="next-button">Next</button>
                                </form>
                            )}
                            {currentStep === 2 && (
                                <form onSubmit={nextStep}>
                                    <div className="form-group">
                                        <label htmlFor="email">Email*</label>
                                        <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="education">Education*</label>
                                        <input type="text" id="education" name="education" value={education} onChange={(e) => setEducation(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="religiousEducation">Religious Education*</label>
                                        <input type="text" id="religiousEducation" name="religiousEducation" value={religiousEducation} onChange={(e) => setReligiousEducation(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="weight">Weight (in kg)*</label>
                                        <input type="number" id="weight" name="weight" value={weight} onChange={(e) => setWeight(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="height">Height (in cm)*</label>
                                        <input type="number" id="height" name="height" value={height} onChange={(e) => setHeight(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="dateOfBirth">Date of Birth*</label>
                                        <input type="date" id="dateOfBirth" name="dateOfBirth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="address">Address*</label>
                                        <input type="text" id="address" name="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="state">State*</label>
                                        <select id="state" name="state" value={selectedState} onChange={(e) => {
                                            setSelectedState(e.target.value);
                                            setSelectedCity(''); // Reset city when state changes
                                        }} required>
                                            <option value="">Select State</option>
                                            {states.map(state => <option key={state.isoCode} value={state.isoCode}>{state.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="city">City*</label>
                                        <select id="city" name="city" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} required>
                                            <option value="">Select City</option>
                                            {filteredCities.map(city => <option key={city.name} value={city.name}>{city.name}</option>)}
                                        </select>
                                    </div>
                                    <button type="button" className="back-button" onClick={prevStep}>Back</button>
                                    <button type="submit" className="next-button">Next</button>
                                </form>
                            )}
                            {currentStep === 3 && (
                                <form onSubmit={handleYatraRegistrationSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="phone">Phone*</label>
                                        <input type="tel" id="phone" name="phone" value={yatraRegistrationData.phone} onChange={handleYatraRegistrationChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="address">Address*</label>
                                        <input type="text" id="address" name="address" value={yatraRegistrationData.address} onChange={handleYatraRegistrationChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="city">City*</label>
                                        <input type="text" id="city" name="city" value={yatraRegistrationData.city} onChange={handleYatraRegistrationChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="state">State*</label>
                                        <input type="text" id="state" name="state" value={yatraRegistrationData.state} onChange={handleYatraRegistrationChange} required />
                                    </div>
                                    <button type="button" className="back-button" onClick={prevStep}>Back</button>
                                    <button type="submit" className="next-button">Next</button>
                                </form>
                            )}
                        </div>
                      ) : (
                        <form onSubmit={handleDefaultRegistrationSubmit}>
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name*</label>
                                <input type="text" id="fullName" name="fullName" placeholder="Enter your full name" value={defaultRegistrationData.fullName} onChange={(e) => setDefaultRegistrationData({ ...defaultRegistrationData, fullName: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address*</label>
                                <input type="email" id="email" name="email" placeholder="Enter your email address" value={defaultRegistrationData.email} onChange={(e) => setDefaultRegistrationData({ ...defaultRegistrationData, email: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number*</label>
                                <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" value={defaultRegistrationData.phone} onChange={(e) => setDefaultRegistrationData({ ...defaultRegistrationData, phone: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Additional Message</label>
                                <textarea id="message" name="message" placeholder="Any specific requirements or questions..." rows="4" style={{ maxWidth: "316px" }} value={defaultRegistrationData.message} onChange={(e) => setDefaultRegistrationData({ ...defaultRegistrationData, message: e.target.value })}></textarea>
                            </div>
                            <button type="submit" className="submit-btn" disabled={isSubmittingRegistration}>{isSubmittingRegistration ? 'Submitting...' : 'Register Now'}</button>
                        </form>
                      )}
                    </>
                  )}
                </>
              )}

              <div className="contact-info">
                <p>For inquiries, please contact us:</p>
                {/* <a href="tel:9426364451">+91 9426364451</a> */}
                <a href="mailto:namonamahshaswatparivar9@gmail.com">namonamahshaswatparivar9@gmail.com</a>
              </div>
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
      <Footer />
    </>
  );
};

export default EventDetails;

import React, { useState, useEffect } from 'react';
import './Donation.css';
import { QRCodeSVG } from 'qrcode.react';
import Footer from '../components/Footer';
import emailjs from "emailjs-com";

const Donation = () => {
  const initialFormState = {
    name: '',
    category: '',
    phone: '',
    address: '',
    amount: '',
    message: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [qrData, setQrData] = useState(null);
  const [timer, setTimer] = useState(10);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (qrData && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [qrData, timer]);

  useEffect(() => {
    if (timer === 0) {
      setQrData(null);
      setSubmitted(false);
      setFormData(initialFormState);
      setError('QR Code expired. Please resubmit the form.');
    }
  }, [timer]);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs
    .sendForm(
      "service_264rxjp",
      "template_7oremm9",
      e.target, // Sends form data to the template
      "7vYFlUx2o5N3Cv3Ll"
    )
    const { name, category, phone, address, amount } = formData;
    if (!name || !category || !phone || !address || !amount) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitted(true);
    const qrString = `upi://pay?pa=namonamahshashwatcha.62486048@hdfcbank&pn=${formData.name}&am=${formData.amount}&cu=INR&tn=${formData.message}`;
    setQrData(qrString);
    setTimer(300); // 5 minutes
  };

  const handleBack = () => {
    setSubmitted(false);
    setQrData(null);
    setFormData(initialFormState);
    setError('');
    setTimer(10);
  };

  return (
    <>
    <div className="donation-container">
      <h1 className="heading" style={{marginTop: "0px"}}>Donation Form</h1>
      {!submitted && (
        <form className="donation-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="દેવદ્રવ્ય ખાતે">દેવદ્રવ્ય ખાતે</option>
            <option value="સાધુ-સાધ્વી વૈયાવચ્ચ ફંડ ખાતે">સાધુ-સાધ્વી વૈયાવચ્ચ ફંડ ખાતે</option>
            <option value="સાધર્મિક ખાતે">સાધર્મિક ખાતે</option>
            <option value="સાધારણ ફંડ ખાતે">સાધારણ ફંડ ખાતે</option>
            <option value="જીવદયા ખાતે">જીવદયા ખાતે</option>
            <option value="અનુકંપા ખાતે">અનુકંપા ખાતે</option>
          </select>
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
          <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} required />
          <textarea name="message" placeholder="Message (optional)" value={formData.message} onChange={handleChange} />
          <button type="submit">Submit</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      )}

      {submitted && qrData && timer > 0 && (
        <div className="qr-section">
          <p>Scan the QR code below to complete your donation. Valid for: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}</p>
          <QRCodeSVG value={qrData} size={256} />
          <br />
          <button className="back-button" onClick={handleBack}>Back</button>
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default Donation;

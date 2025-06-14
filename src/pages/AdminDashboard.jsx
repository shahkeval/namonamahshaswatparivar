import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Typography, Button, CircularProgress } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const COLORS = ['#1ecb4f', '#1e9ecb', '#a01ecb', '#cb1e7c'];

const donutDataTemplate = [
  { label: 'Donations', key: 'donations' },
  { label: 'Registrations', key: 'registrations' },
];

const AdminDashboard = () => {
  const [donationSummary, setDonationSummary] = useState({ totalAmount: 0, byCategory: [] });
  const [registrationSummary, setRegistrationSummary] = useState({ totalCount: 0, byCategory: [] });
  const [loadingDonations, setLoadingDonations] = useState(true);
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Admin';

  useEffect(() => {
    const fetchDonationSummary = async () => {
      setLoadingDonations(true);
      try {
        const res = await axios.get('https://namonamahshaswatparivar-dt17.vercel.app/api/donations/summary');
        setDonationSummary(res.data);
      } catch {
        setDonationSummary({ totalAmount: 0, byCategory: [] });
      }
      setLoadingDonations(false);
    };

    const fetchRegistrationSummary = async () => {
      setLoadingRegistrations(true);
      try {
        const res = await axios.get('https://namonamahshaswatparivar-dt17.vercel.app/api/rssmsu/rsummary');
        console.log('Registration Summary Response:', res.data);
        setRegistrationSummary(res.data);
      } catch (error) {
        console.error('Error fetching registration summary:', error);
        setRegistrationSummary({ totalCount: 0, byCategory: [] });
      }
      setLoadingRegistrations(false);
    };

    fetchDonationSummary();
    fetchRegistrationSummary();
  }, []);

  // Prepare donut data for donations
  const donationDonutData = donationSummary.byCategory.length > 0
    ? donationSummary.byCategory
    : [{ category: 'No Donations', amount: donationSummary.totalAmount }];

  // Prepare donut data for registrations
  const registrationDonutData = registrationSummary.byCategory.length > 0
    ? registrationSummary.byCategory
    : [{ category: 'No Registrations', amount: registrationSummary.totalCount }];

  const donutCharts = donutDataTemplate.map((item, idx) => {
    const isFirst = idx === 0;
    const data = isFirst ? donationDonutData : registrationDonutData;

    return (
      <div className="donut-chart-box" key={item.key}>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey={isFirst ? "amount" : "count"}
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#1ecb4f"
              labelLine={false}
              label={false}
            >
              {data.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="bold" fill="#222">
              Total: {isFirst ? donationSummary.totalAmount : registrationSummary.totalCount}/-
            </text>
          </PieChart>
        </ResponsiveContainer>
        <Button
          className="know-more-btn"
          onClick={() => isFirst ? navigate('/admin/donations') : navigate('/admin/rssmregistrations')}
          sx={{ mt: 1, fontWeight: 'bold', color: '#222', textTransform: 'none', fontSize: 14 }}
        >
          Know More <span style={{ marginLeft: 4 }}>→</span>
        </Button>
        <Typography className="donut-label" sx={{ fontWeight: 'bold', mt: 1 }}>{item.label}</Typography>
      </div>
    );
  });

  return (
    <>
      <Navbar />
      <div className="admin-dashboard-root">
        <div className="admin-main-content">
          <Typography variant="h3" className="welcome-title">Welcome {username.toLowerCase()},</Typography>
          <div className="donut-row">
            {loadingDonations || loadingRegistrations ? <CircularProgress /> : donutCharts}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;

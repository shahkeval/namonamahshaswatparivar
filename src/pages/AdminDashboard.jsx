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
  { label: 'xyz', key: 'xyz1' },
  { label: 'xyz', key: 'xyz2' },
  { label: 'xyz', key: 'xyz3' },
];

const AdminDashboard = () => {
  const [summary, setSummary] = useState({ totalAmount: 0, byCategory: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Admin';

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/donations/summary');
        setSummary(res.data);
      } catch {
        setSummary({ totalAmount: 0, byCategory: [] });
      }
      setLoading(false);
    };
    fetchSummary();
  }, []);

  // Prepare donut data (mock for now, use summary for first chart)
  const donutCharts = donutDataTemplate.map((item, idx) => {
    const isFirst = idx === 0;
    const data = isFirst && summary.byCategory.length > 0
      ? summary.byCategory
      : [
          { category: item.label, amount: summary.totalAmount },
          { category: '', amount: 0 },
        ];
    return (
      <div className="donut-chart-box" key={item.key}>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
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
              Total: {summary.totalAmount}/-
            </text>
          </PieChart>
        </ResponsiveContainer>
        <Button
          className="know-more-btn"
          onClick={() => isFirst && navigate('/admin/donations')}
          sx={{ mt: 1, fontWeight: 'bold', color: '#222', textTransform: 'none', fontSize: 14 }}
          disabled={!isFirst}
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
            {loading ? <CircularProgress /> : donutCharts}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;

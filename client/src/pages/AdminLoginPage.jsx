import { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  Avatar,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AuthLayout from '../components/AuthLayout.jsx';

export default function AdminLoginPage() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await adminLogin(form);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Admin Portal"
      title="Manage submissions with ease"
      description="Log in to review, edit, filter, and manage every customer submission from one dashboard."
      features={[
        'Search and filter submissions instantly',
        'Edit or remove records in a click',
        'Restricted to authorized admin accounts only',
      ]}
      gradient="linear-gradient(135deg, #312e81 0%, #0f172a 100%)"
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Avatar sx={{ bgcolor: '#312e81' }}>
            <AdminPanelSettingsIcon />
          </Avatar>
          <Typography variant="h5" fontWeight={700}>
            Admin Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Restricted access — admins only
          </Typography>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" size="large" disabled={submitting} fullWidth sx={{ bgcolor: '#312e81', '&:hover': { bgcolor: '#252163' } }}>
              {submitting ? 'Logging in…' : 'Login'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </AuthLayout>
  );
}

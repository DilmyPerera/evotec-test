import { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  Link,
  Avatar,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AuthLayout from '../components/AuthLayout.jsx';

export default function CustomerLoginPage() {
  const { login } = useAuth();
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
      await login(form);
      navigate('/application');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Customer Portal"
      title="Welcome back"
      description="Log in to submit your details and keep track of your application with us."
      features={[
        'A quick, guided application form',
        'Your submission is saved securely under your account',
        'Protected by JWT-based authentication',
      ]}
      gradient="linear-gradient(135deg, #1a56db 0%, #1e3a8a 100%)"
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <LoginIcon />
          </Avatar>
          <Typography variant="h5" fontWeight={700}>
            Customer Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your credentials to continue
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
            <Button type="submit" variant="contained" size="large" disabled={submitting} fullWidth>
              {submitting ? 'Logging in…' : 'Login'}
            </Button>
          </Stack>
        </form>

        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
          No account yet? <Link component={RouterLink} to="/register">Register</Link>
        </Typography>
      </Paper>
    </AuthLayout>
  );
}

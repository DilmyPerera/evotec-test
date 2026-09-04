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
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AuthLayout from '../components/AuthLayout.jsx';

export default function CustomerRegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFieldErrors({});
    setSubmitting(true);
    try {
      await register(form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      const data = err.response?.data;
      if (data?.details) {
        const mapped = {};
        data.details.forEach((d) => {
          mapped[d.field] = d.message;
        });
        setFieldErrors(mapped);
      } else {
        setFormError(data?.error || 'Registration failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Get Started"
      title="Create your account"
      description="Register as a customer to submit your details through a simple, guided form."
      features={[
        'Takes less than a minute to sign up',
        'Update or track your submission any time',
        'Your password is securely hashed, never stored in plain text',
      ]}
      gradient="linear-gradient(135deg, #1a56db 0%, #1e3a8a 100%)"
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <PersonAddAltIcon />
          </Avatar>
          <Typography variant="h5" fontWeight={700}>
            Customer Registration
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create an account to get started
          </Typography>
        </Stack>

        {success && <Alert severity="success" sx={{ mb: 2 }}>Account created! Redirecting to login…</Alert>}
        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

        <form onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password || 'Minimum 4 characters'}
              required
              fullWidth
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={!!fieldErrors.confirmPassword}
              helperText={fieldErrors.confirmPassword}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" size="large" disabled={submitting} fullWidth>
              {submitting ? 'Creating account…' : 'Register'}
            </Button>
          </Stack>
        </form>

        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
          Already have an account? <Link component={RouterLink} to="/login">Log in</Link>
        </Typography>
      </Paper>
    </AuthLayout>
  );
}

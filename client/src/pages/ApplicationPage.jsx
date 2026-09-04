import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  gender: '',
  mobileNumber: '',
  address: '',
  feedback: '',
};

export default function ApplicationPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
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
      const payload = { ...form };
      if (!payload.feedback) delete payload.feedback;

      await axiosClient.post('/submissions', payload);
      navigate('/application/success');
    } catch (err) {
      const data = err.response?.data;
      if (data?.details) {
        const mapped = {};
        data.details.forEach((d) => {
          mapped[d.field] = d.message;
        });
        setFieldErrors(mapped);
      } else {
        setFormError(data?.error || 'Submission failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          Submit Your Details
        </Typography>

        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

        <form onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="First Name"
                value={form.firstName}
                onChange={handleChange('firstName')}
                error={!!fieldErrors.firstName}
                helperText={fieldErrors.firstName}
                required
                fullWidth
              />
              <TextField
                label="Last Name"
                value={form.lastName}
                onChange={handleChange('lastName')}
                error={!!fieldErrors.lastName}
                helperText={fieldErrors.lastName}
                required
                fullWidth
              />
            </Stack>

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
              select
              label="Gender"
              value={form.gender}
              onChange={handleChange('gender')}
              error={!!fieldErrors.gender}
              helperText={fieldErrors.gender}
              required
              fullWidth
            >
              <MenuItem value="MALE">Male</MenuItem>
              <MenuItem value="FEMALE">Female</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </TextField>

            <TextField
              label="Mobile Number"
              value={form.mobileNumber}
              onChange={handleChange('mobileNumber')}
              error={!!fieldErrors.mobileNumber}
              helperText={fieldErrors.mobileNumber || 'e.g. 0712345678'}
              required
              fullWidth
            />

            <TextField
              label="Address"
              value={form.address}
              onChange={handleChange('address')}
              error={!!fieldErrors.address}
              helperText={fieldErrors.address}
              required
              multiline
              minRows={2}
              fullWidth
            />

            <TextField
              label="Feedback (optional)"
              value={form.feedback}
              onChange={handleChange('feedback')}
              multiline
              minRows={2}
              fullWidth
            />

            <Button type="submit" variant="contained" disabled={submitting} fullWidth>
              {submitting ? 'Submitting…' : 'Submit'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

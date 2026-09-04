import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Stack,
  Alert,
} from '@mui/material';

export default function SubmissionEditDialog({ submission, onClose, onSave }) {
  const [form, setForm] = useState(submission);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(submission);
    setFieldErrors({});
    setFormError('');
  }, [submission]);

  if (!submission) return null;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setFormError('');
    setFieldErrors({});
    setSaving(true);
    try {
      const { id, firstName, lastName, email, gender, mobileNumber, address, feedback } = form;
      await onSave(id, { firstName, lastName, email, gender, mobileNumber, address, feedback });
    } catch (err) {
      const data = err.response?.data;
      if (data?.details) {
        const mapped = {};
        data.details.forEach((d) => {
          mapped[d.field] = d.message;
        });
        setFieldErrors(mapped);
      } else {
        setFormError(data?.error || 'Update failed. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Submission</DialogTitle>
      <DialogContent>
        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="First Name"
              value={form.firstName}
              onChange={handleChange('firstName')}
              error={!!fieldErrors.firstName}
              helperText={fieldErrors.firstName}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={form.lastName}
              onChange={handleChange('lastName')}
              error={!!fieldErrors.lastName}
              helperText={fieldErrors.lastName}
              fullWidth
            />
          </Stack>
          <TextField
            label="Email"
            value={form.email}
            onChange={handleChange('email')}
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
            fullWidth
          />
          <TextField
            select
            label="Gender"
            value={form.gender}
            onChange={handleChange('gender')}
            error={!!fieldErrors.gender}
            helperText={fieldErrors.gender}
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
            helperText={fieldErrors.mobileNumber}
            fullWidth
          />
          <TextField
            label="Address"
            value={form.address}
            onChange={handleChange('address')}
            error={!!fieldErrors.address}
            helperText={fieldErrors.address}
            multiline
            minRows={2}
            fullWidth
          />
          <TextField
            label="Feedback"
            value={form.feedback || ''}
            onChange={handleChange('feedback')}
            multiline
            minRows={2}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

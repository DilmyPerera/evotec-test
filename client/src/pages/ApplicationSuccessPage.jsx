import { Container, Paper, Typography, Button, Stack } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';

export default function ApplicationSuccessPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: { xs: 6, md: 10 } }}>
      <Paper elevation={2} sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Submission Successful
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Thank you! Your details have been submitted successfully.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button variant="contained" onClick={() => navigate('/application')}>
            Submit Another
          </Button>
          <Button variant="outlined" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

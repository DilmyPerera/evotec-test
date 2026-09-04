import { Box, Container, Typography, Button, Stack, Grid, Paper, Avatar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LockPersonIcon from '@mui/icons-material/LockPerson';

const FEATURES = [
  {
    icon: <HowToRegIcon />,
    title: 'For Customers',
    description: 'Register, log in, and submit your details through a simple guided form.',
  },
  {
    icon: <AdminPanelSettingsIcon />,
    title: 'For Admins',
    description: 'Review, edit, filter, and manage every submission from one dashboard.',
  },
  {
    icon: <LockPersonIcon />,
    title: 'Secure by Design',
    description: 'JWT authentication and role-based access keep every route protected.',
  },
];

export default function HomePage() {
  return (
    <Box>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a56db 0%, #1e3a8a 100%)',
          color: '#fff',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="overline" sx={{ letterSpacing: 3, opacity: 0.85, fontWeight: 600 }}>
            Evotec Technical Assignment
          </Typography>
          <Typography variant="h3" fontWeight={700} sx={{ mt: 1, mb: 2, fontSize: { xs: '2rem', md: '2.75rem' } }}>
            Submit and manage forms, simply and securely
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mb: 4, maxWidth: 560, mx: 'auto' }}>
            A full-stack form-submission system with customer and admin roles,
            JWT authentication, and an admin dashboard with filtering and search.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button variant="contained" size="large" color="inherit" sx={{ color: '#1e3a8a', fontWeight: 600 }} component={RouterLink} to="/register">
              Get Started
            </Button>
            <Button variant="outlined" size="large" color="inherit" component={RouterLink} to="/login">
              Customer Login
            </Button>
            <Button variant="text" size="large" color="inherit" component={RouterLink} to="/admin/login">
              Admin Login
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={3}>
          {FEATURES.map((feature) => (
            <Grid item xs={12} sm={4} key={feature.title}>
              <Paper elevation={1} sx={{ p: 3, height: '100%', borderRadius: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>{feature.icon}</Avatar>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

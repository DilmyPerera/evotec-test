import { Container, Typography, Button, Stack, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function HomePage() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Evotec Full-Stack Assignment
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          A form-submission and management system with customer and admin
          roles, JWT authentication, and an admin dashboard with filtering
          and search.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" component={RouterLink} to="/register">
            Get Started
          </Button>
          <Button variant="outlined" component={RouterLink} to="/login">
            Customer Login
          </Button>
          <Button variant="text" component={RouterLink} to="/admin/login">
            Admin Login
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

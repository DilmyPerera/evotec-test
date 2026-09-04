import { AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}
        >
          Evotec Assignment
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          {!user && (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Customer Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Register
              </Button>
              <Button color="inherit" component={RouterLink} to="/admin/login">
                Admin Login
              </Button>
            </>
          )}

          {user && user.role === 'CUSTOMER' && (
            <>
              <Button color="inherit" component={RouterLink} to="/application">
                Application
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout ({user.email})
              </Button>
            </>
          )}

          {user && user.role === 'ADMIN' && (
            <>
              <Button color="inherit" component={RouterLink} to="/admin/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout ({user.email})
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

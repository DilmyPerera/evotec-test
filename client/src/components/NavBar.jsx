import { AppBar, Toolbar, Typography, Button, Stack, Chip, IconButton, Tooltip, Divider } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { useAuth } from '../context/AuthContext.jsx';

function NavLink({ to, children }) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Button
      component={RouterLink}
      to={to}
      sx={{
        color: '#fff',
        px: 2,
        borderRadius: 2,
        fontWeight: active ? 700 : 500,
        bgcolor: active ? 'rgba(255,255,255,0.16)' : 'transparent',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
      }}
    >
      {children}
    </Button>
  );
}

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: '#1e3a8a',
        boxShadow: '0 2px 12px rgba(15, 23, 42, 0.25)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          component={RouterLink}
          to="/"
          sx={{ color: 'inherit', textDecoration: 'none' }}
        >
          <DescriptionRoundedIcon />
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.3 }}>
            Evotec Assignment
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          {!user && (
            <>
              <NavLink to="/login">Customer Login</NavLink>
              <NavLink to="/admin/login">Admin Login</NavLink>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                sx={{
                  ml: 1,
                  bgcolor: '#fff',
                  color: '#1e3a8a',
                  fontWeight: 700,
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#e5e9f5' },
                }}
              >
                Register
              </Button>
            </>
          )}

          {user && user.role === 'CUSTOMER' && (
            <>
              <NavLink to="/application">Application</NavLink>
              <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.25)', my: 1 }} />
              <Chip
                icon={<PersonRoundedIcon sx={{ color: '#fff !important' }} />}
                label={user.email}
                sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.14)', fontWeight: 500 }}
              />
              <Tooltip title="Logout">
                <IconButton onClick={handleLogout} sx={{ color: '#fff' }}>
                  <LogoutRoundedIcon />
                </IconButton>
              </Tooltip>
            </>
          )}

          {user && user.role === 'ADMIN' && (
            <>
              <NavLink to="/admin/dashboard">Dashboard</NavLink>
              <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.25)', my: 1 }} />
              <Chip
                icon={<PersonRoundedIcon sx={{ color: '#fff !important' }} />}
                label={user.email}
                sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.14)', fontWeight: 500 }}
              />
              <Tooltip title="Logout">
                <IconButton onClick={handleLogout} sx={{ color: '#fff' }}>
                  <LogoutRoundedIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

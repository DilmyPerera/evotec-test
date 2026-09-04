import { Box, Stack, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function AuthLayout({ eyebrow, title, description, features = [], gradient, children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 80px)', flexDirection: { xs: 'column', md: 'row' } }}>
      <Box
        sx={{
          flex: { xs: 'none', md: '0 0 44%' },
          background: gradient,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          px: { xs: 4, md: 8 },
          py: { xs: 6, md: 0 },
        }}
      >
        <Stack spacing={3} sx={{ maxWidth: 440 }}>
          <Typography variant="overline" sx={{ letterSpacing: 3, opacity: 0.85, fontWeight: 600 }}>
            {eyebrow}
          </Typography>
          <Typography variant="h3" fontWeight={700} sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, lineHeight: 1.2 }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.88 }}>
            {description}
          </Typography>
          {features.length > 0 && (
            <Stack spacing={1.5} sx={{ mt: 2 }}>
              {features.map((feature) => (
                <Stack direction="row" spacing={1.5} alignItems="flex-start" key={feature}>
                  <CheckCircleIcon sx={{ fontSize: 20, mt: '2px', opacity: 0.9 }} />
                  <Typography variant="body2" sx={{ opacity: 0.92 }}>
                    {feature}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 6 },
          bgcolor: 'background.default',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

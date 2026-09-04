import { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TextField,
  MenuItem,
  Stack,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosClient from '../api/axiosClient';
import SubmissionEditDialog from '../components/SubmissionEditDialog.jsx';

export default function AdminDashboardPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gender, setGender] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (gender) params.gender = gender;
      if (search) params.search = search;
      const { data } = await axiosClient.get('/submissions', { params });
      setSubmissions(data.submissions);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load submissions.');
    } finally {
      setLoading(false);
    }
  }, [gender, search]);

  useEffect(() => {
    const timeout = setTimeout(fetchSubmissions, 250);
    return () => clearTimeout(timeout);
  }, [fetchSubmissions]);

  const handleSave = async (id, payload) => {
    const { data } = await axiosClient.patch(`/submissions/${id}`, payload);
    setSubmissions((prev) => prev.map((s) => (s.id === id ? data.submission : s)));
    setEditing(null);
  };

  const handleDelete = async () => {
    await axiosClient.delete(`/submissions/${deleting.id}`);
    setSubmissions((prev) => prev.filter((s) => s.id !== deleting.id));
    setDeleting(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Admin Dashboard
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          select
          label="Filter by Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="MALE">Male</MenuItem>
          <MenuItem value="FEMALE">Female</MenuItem>
          <MenuItem value="OTHER">Other</MenuItem>
        </TextField>
        <TextField
          label="Search by name"
          placeholder="First or last name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={1}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Feedback</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}

              {!loading && submissions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    No submissions found.
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                submissions.map((s) => (
                  <TableRow key={s.id} hover>
                    <TableCell>{s.firstName} {s.lastName}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>
                      <Chip label={s.gender} size="small" />
                    </TableCell>
                    <TableCell>{s.mobileNumber}</TableCell>
                    <TableCell sx={{ maxWidth: 180 }}>{s.address}</TableCell>
                    <TableCell sx={{ maxWidth: 180 }}>{s.feedback || '—'}</TableCell>
                    <TableCell>{new Date(s.dateCreated).toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => setEditing(s)} aria-label="edit">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => setDeleting(s)} aria-label="delete">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <SubmissionEditDialog
        submission={editing}
        onClose={() => setEditing(null)}
        onSave={handleSave}
      />

      <Dialog open={!!deleting} onClose={() => setDeleting(null)}>
        <DialogTitle>
          Delete submission from {deleting?.firstName} {deleting?.lastName}?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

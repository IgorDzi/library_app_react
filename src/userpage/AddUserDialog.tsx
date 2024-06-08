import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useApi } from '../ApiProvider';
import { RegisterDto } from '../api/dto/user.dto';

interface AddUserDialogProps {
  open: boolean;
  onClose: (refresh: boolean) => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ open, onClose }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [role, setRole] = useState<string>('ROLE_READER');
  const apiClient = useApi();

  const handleAddUser = async () => {
    try {
      const data: RegisterDto = { username, password, role, email, fullName };
      const response = await apiClient.addUser(data);
      if (response.success) {
        onClose(true);
      } else {
        alert('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>Add User</DialogTitle>
      <DialogContent>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value as string)}
          >
            <MenuItem value="ROLE_READER">ROLE_READER</MenuItem>
            <MenuItem value="ROLE_ADMIN">ROLE_ADMIN</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddUser} color="primary">
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;

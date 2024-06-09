import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useApi } from '../ApiProvider';
import { RegisterDto } from '../api/dto/user.dto';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const handleAddUser = async () => {
    try {
      const data: RegisterDto = { username, password, role, email, fullName };
      const response = await apiClient.addUser(data);
      if (response.success) {
        onClose(true);
      } else {
        alert(t('addUser.addFailed'));
      }
    } catch (error) {
      console.error(t('addUser.errorAddingUser'), error);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>{t('addUser.title')}</DialogTitle>
      <DialogContent>
        <TextField
          label={t('addUser.username')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label={t('addUser.password')}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label={t('addUser.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label={t('addUser.fullName')}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>{t('addUser.role')}</InputLabel>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value as string)}
          >
            <MenuItem value="ROLE_READER">{t('addUser.roleReader')}</MenuItem>
            <MenuItem value="ROLE_ADMIN">{t('addUser.roleAdmin')}</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="primary">
          {t('addUser.cancel')}
        </Button>
        <Button onClick={handleAddUser} color="primary">
          {t('addUser.addUser')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;

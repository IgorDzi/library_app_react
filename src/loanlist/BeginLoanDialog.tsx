import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { useApi } from '../ApiProvider';
import { GetBookDto } from '../api/dto/books.dto';
import { GetUserDto } from '../api/dto/user.dto';

interface BeginLoanDialogProps {
  open: boolean;
  onClose: (refresh: boolean) => void;
}

const validationSchema = yup.object({
  book: yup.number().required('Book is required'),
  user: yup.number().required('User is required'),
  days: yup.number().required('Number of days is required').min(1),
});

const BeginLoanDialog: React.FC<BeginLoanDialogProps> = ({ open, onClose }) => {
  const apiClient = useApi();
  const [books, setBooks] = useState<GetBookDto[]>([]);
  const [users, setUsers] = useState<GetUserDto[]>([]);

  useEffect(() => {
    const fetchBooksAndUsers = async () => {
      try {
        const [bookResponse, userResponse] = await Promise.all([
          apiClient.getBooks(),
          apiClient.getUsers(),
        ]);
        if (bookResponse.success) {
          setBooks(bookResponse.data || []);
        } else {
          console.error('Failed to fetch books');
        }
        if (userResponse.success) {
          setUsers(userResponse.data || []);
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching books or users:', error);
      }
    };
    if (open) {
      fetchBooksAndUsers();
    }
  }, [open, apiClient]);

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      console.log('Submitting loan:', values);
      const response = await apiClient.beginLoan(values);
      console.log('API Response:', response);
      if (response.success) {
        resetForm();
        onClose(true);
      } else {
        alert('Failed to begin loan');
        onClose(false);
      }
    } catch (error) {
      console.error('Error beginning loan:', error);
      onClose(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Begin Loan</DialogTitle>
      <Formik
        initialValues={{
          book: '',
          user: '',
          days: 0,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                name="book"
                label="Book"
                select
                fullWidth
                margin="normal"
                variant="outlined"
                required
              >
                {books.map((book) => (
                  <MenuItem key={book.id} value={book.id}>
                    {book.title} (ID: {book.id})
                  </MenuItem>
                ))}
              </Field>
              <Field
                as={TextField}
                name="user"
                label="User"
                select
                fullWidth
                margin="normal"
                variant="outlined"
                required
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.fullName} (ID: {user.id})
                  </MenuItem>
                ))}
              </Field>
              <Field
                as={TextField}
                name="days"
                label="Number of Days"
                type="number"
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => onClose(false)} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Begin Loan'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default BeginLoanDialog;

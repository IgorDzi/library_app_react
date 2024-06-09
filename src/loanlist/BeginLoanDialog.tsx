import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { useApi } from '../ApiProvider';
import { GetBookDto } from '../api/dto/books.dto';
import { GetUserDto } from '../api/dto/user.dto';
import { useTranslation } from 'react-i18next';

interface BeginLoanDialogProps {
  open: boolean;
  onClose: (refresh: boolean) => void;
}

const BeginLoanDialog: React.FC<BeginLoanDialogProps> = ({ open, onClose }) => {
  const apiClient = useApi();
  const { t } = useTranslation();
  const [books, setBooks] = useState<GetBookDto[]>([]);
  const [users, setUsers] = useState<GetUserDto[]>([]);

  const validationSchema = yup.object({
    book: yup.number().required(t('beginLoan.bookRequired')),
    user: yup.number().required(t('beginLoan.userRequired')),
    days: yup.number().required(t('beginLoan.daysRequired')).min(1, t('beginLoan.daysMin')),
  });

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
          console.error(t('beginLoan.fetchBooksFailed'));
        }
        if (userResponse.success) {
          setUsers(userResponse.data || []);
        } else {
          console.error(t('beginLoan.fetchUsersFailed'));
        }
      } catch (error) {
        console.error(t('beginLoan.fetchError'), error);
      }
    };
    if (open) {
      fetchBooksAndUsers();
    }
  }, [open, apiClient, t]);

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      const response = await apiClient.beginLoan(values);
      if (response.success) {
        resetForm();
        onClose(true);
      } else {
        alert(t('beginLoan.beginFailed'));
        onClose(false);
      }
    } catch (error) {
      console.error(t('beginLoan.errorBeginningLoan'), error);
      onClose(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{t('beginLoan.title')}</DialogTitle>
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
                label={t('beginLoan.book')}
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
                label={t('beginLoan.user')}
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
                label={t('beginLoan.days')}
                type="number"
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => onClose(false)} color="primary">
                {t('beginLoan.cancel')}
              </Button>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                {isSubmitting ? t('beginLoan.submitting') : t('beginLoan.beginLoan')}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default BeginLoanDialog;

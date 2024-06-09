import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { useApi } from '../ApiProvider';
import { useTranslation } from 'react-i18next';

interface AddBookDialogProps {
  open: boolean;
  onClose: (refresh: boolean) => void;
}

const AddBookDialog: React.FC<AddBookDialogProps> = ({ open, onClose }) => {
  const apiClient = useApi();
  const { t } = useTranslation();

  const validationSchema = yup.object({
    isbn: yup.string().required(t('addBook.isbnRequired')),
    title: yup.string().required(t('addBook.titleRequired')),
    author: yup.string().required(t('addBook.authorRequired')),
    publisher: yup.string().required(t('addBook.publisherRequired')),
    publicationYear: yup.number().required(t('addBook.publicationYearRequired')).min(0),
    availableCopies: yup.number().required(t('addBook.availableCopiesRequired')).min(0),
  });

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      const response = await apiClient.createBook(values);
      if (response.success) {
        resetForm();
        onClose(true);
      } else {
        alert(t('addBook.addFailed'));
        onClose(false);
      }
    } catch (error) {
      console.error(t('addBook.errorAddingBook'), error);
      onClose(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{t('addBook.title')}</DialogTitle>
      <Formik
        initialValues={{
          isbn: '',
          title: '',
          author: '',
          publisher: '',
          publicationYear: 0,
          availableCopies: 0,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                name="isbn"
                label={t('addBook.isbn')}
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
              <Field
                as={TextField}
                name="title"
                label={t('addBook.book-title')}
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
              <Field
                as={TextField}
                name="author"
                label={t('addBook.author')}
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
              <Field
                as={TextField}
                name="publisher"
                label={t('addBook.publisher')}
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
              <Field
                as={TextField}
                name="publicationYear"
                label={t('addBook.publicationYear')}
                type="number"
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
              <Field
                as={TextField}
                name="availableCopies"
                label={t('addBook.availableCopies')}
                type="number"
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => onClose(false)} color="primary">
                {t('addBook.cancel')}
              </Button>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                {isSubmitting ? t('addBook.adding') : t('addBook.addBook')}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddBookDialog;

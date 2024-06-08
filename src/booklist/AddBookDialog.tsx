import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { useApi } from '../ApiProvider';

interface AddBookDialogProps {
  open: boolean;
  onClose: (refresh: boolean) => void;
}

const validationSchema = yup.object({
  isbn: yup.string().required('ISBN is required'),
  title: yup.string().required('Title is required'),
  author: yup.string().required('Author is required'),
  publisher: yup.string().required('Publisher is required'),
  publicationYear: yup.number().required('Publication Year is required').min(0),
  availableCopies: yup.number().required('Number of copies is required').min(0),
});

const AddBookDialog: React.FC<AddBookDialogProps> = ({ open, onClose }) => {
  const apiClient = useApi();

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      const response = await apiClient.createBook(values);
      if (response.success) {
        resetForm();
        onClose(true);
      } else {
        alert('Failed to add book');
        onClose(false);
      }
    } catch (error) {
      console.error('Error adding book:', error);
      onClose(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Add Book</DialogTitle>
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
                label="ISBN"
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
              <Field
                as={TextField}
                name="title"
                label="Title"
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
              <Field
                as={TextField}
                name="author"
                label="Author"
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
              <Field
                as={TextField}
                name="publisher"
                label="Publisher"
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
              <Field
                as={TextField}
                name="publicationYear"
                label="Publication Year"
                type="number"
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
              <Field
                as={TextField}
                name="availableCopies"
                label="Available Copies"
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
                {isSubmitting ? 'Adding...' : 'Add Book'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddBookDialog;

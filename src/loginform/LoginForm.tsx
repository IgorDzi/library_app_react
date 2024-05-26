import React, { useCallback, useMemo } from 'react';
import { Button, TextField, CircularProgress } from '@mui/material';
import { Formik, Form, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const onSubmit = useCallback(
    async (
      values: LoginFormValues,
      { setSubmitting, setErrors }: FormikHelpers<LoginFormValues>,
    ) => {
      console.log(values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (values.username === 'admin' && values.password === 'password') {
        navigate('/home');
      } else {
        setErrors({ username: 'Invalid username or password' });
      }
      setSubmitting(false);
    },
    [navigate],
  );

  const validationSchema = useMemo(
    () =>
      yup.object({
        username: yup.string().required('Username is required'),
        password: yup
          .string()
          .required('Password is required')
          .min(5, 'Password too short'),
      }),
    [],
  );

  return (
    <div className="login-form-container">
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
          dirty,
          isSubmitting,
        }) => (
          <Form
            className="login-form"
            id="signForm"
            onSubmit={handleSubmit}
            noValidate
          >
            <h2>Login</h2>
            <div className="form-group">
              <TextField
                id="username"
                label="Username"
                variant="outlined"
                name="username"
                fullWidth
                margin="normal"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                error={touched.username && !!errors.username}
                helperText={touched.username && errors.username}
              />
            </div>
            <div className="form-group">
              <TextField
                id="password"
                label="Password"
                variant="outlined"
                type="password"
                name="password"
                fullWidth
                margin="normal"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
              />
            </div>
            {errors.username && (
              <div style={{ color: 'red', marginTop: 10 }}>
                {errors.username}
              </div>
            )}
            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={!(isValid && dirty) || isSubmitting}
              className="login-button"
              style={{ backgroundColor: '#14452F', color: 'white' }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;

import React, { useCallback, useMemo } from 'react';
import { Button, TextField } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const onSubmit = useCallback((values: any) => {
    console.log(values);
    // Handle form submission
  }, []);

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        username: yup.string().required('Required'),
        password: yup
          .string()
          .required('Required')
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
        validateOnChange
        validateOnBlur
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
            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={!(isValid && dirty)}
              className="login-button"
              style={{ backgroundColor: '#14452F', color: 'white' }}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;

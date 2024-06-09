import React, { useCallback, useMemo } from 'react';
import { Button, TextField, CircularProgress } from '@mui/material';
import { Formik, Form, FormikHelpers } from 'formik';
import * as yup from 'yup';
import './LoginForm.css';
import { useApi } from '../ApiProvider';
import { useAuth } from '../AuthContext';
import { useTranslation } from 'react-i18next';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const apiClient = useApi();
  const { t } = useTranslation();

  const onSubmit = useCallback(
    async (values: { username: string; password: string }, formik: FormikHelpers<{ username: string; password: string }>) => {
      try {
        const response = await apiClient.login(values);
        if (response.success) {
          login();
        } else {
          formik.setErrors({ username: t('login.invalidCredentials') });
        }
      } catch (error) {
        formik.setErrors({ username: t('login.errorOccurred') });
      } finally {
        formik.setSubmitting(false);
      }
    },
    [apiClient, login, t],
  );

  const validationSchema = useMemo(
    () =>
      yup.object({
        username: yup.string().required(t('login.usernameRequired')),
        password: yup
          .string()
          .required(t('login.passwordRequired'))
          .min(5, t('login.passwordTooShort')),
      }),
    [t],
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
            <h2>{t('login.title')}</h2>
            <div className="form-group">
              <TextField
                id="username"
                label={t('login.username')}
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
                label={t('login.password')}
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
              disabled={!(isValid && dirty) || isSubmitting}
              className="login-button"
              style={{ backgroundColor: '#14452F', color: 'white' }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : t('login.submit')}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;

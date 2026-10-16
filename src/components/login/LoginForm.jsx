import { Formik, Form } from "formik";
import FormInput from "../common/FormInput.jsx";
import Button from "../common/Button.jsx";
import Alert from "../common/Alert.jsx";
import useLogin from "../../hooks/useLogin.js";
import { loginInitialValues, loginSchema } from "../../validation/loginSchema.js";

export default function LoginForm({ onSuccess }) {
  const { submit, error, clearError } = useLogin();

  const handleSubmit = async (values, { setSubmitting }) => {
    const user = await submit(values);
    if (user) onSuccess(user);
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={loginInitialValues}
      validationSchema={loginSchema}
      onSubmit={handleSubmit}
      validateOnBlur
      validateOnChange
    >
      {({ isSubmitting, isValid, dirty }) => (
        <Form noValidate onChange={clearError} className="form">
          <Alert>{error}</Alert>

          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
          />

          <Button type="submit" loading={isSubmitting} disabled={!dirty || !isValid}>
            Log in
          </Button>
        </Form>
      )}
    </Formik>
  );
}

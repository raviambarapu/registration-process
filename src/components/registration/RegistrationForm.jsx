import { Formik, Form } from "formik";
import FormInput from "../common/FormInput.jsx";
import FormSelect from "../common/FormSelect.jsx";
import FormCheckbox from "../common/FormCheckbox.jsx";
import RadioGroup from "../common/RadioGroup.jsx";
import Button from "../common/Button.jsx";
import Alert from "../common/Alert.jsx";
import useRegister from "../../hooks/useRegister.js";
import { initialValues, registrationSchema } from "../../validation/registrationSchema.js";

const courses = [
  { value: "frontend", label: "Frontend Development" },
  { value: "fullstack", label: "Full Stack Development" },
  { value: "data", label: "Data Analytics" },
  { value: "python", label: "Python Programming" },
];

const genders = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export default function RegistrationForm({ onSuccess }) {
  const { submit, error, clearError } = useRegister();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const user = await submit(values);
    if (user) {
      onSuccess({ ...user, firstName: values.firstName, email: values.email });
      resetForm();
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registrationSchema}
      onSubmit={handleSubmit}
      validateOnBlur
      validateOnChange
    >
      {({ isSubmitting, isValid, dirty }) => (
        <Form noValidate onChange={clearError} className="form">
          <Alert>{error}</Alert>

          <div className="grid">
            <FormInput label="First name" name="firstName" placeholder="Ravi" autoComplete="given-name" />
            <FormInput label="Last name" name="lastName" placeholder="Kumar" autoComplete="family-name" />
            <FormInput label="Email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
            <FormInput label="Phone" name="phone" type="tel" placeholder="9876543210" maxLength={10} autoComplete="tel" />
            <FormInput label="Date of birth" name="dob" type="date" />
            <FormSelect label="Course" name="course" options={courses} placeholder="Select a course" />
          </div>

          <RadioGroup label="Gender" name="gender" options={genders} />

          <div className="grid">
            <FormInput label="Password" name="password" type="password" placeholder="••••••••" autoComplete="new-password" />
            <FormInput label="Confirm password" name="confirmPassword" type="password" placeholder="••••••••" autoComplete="new-password" />
          </div>

          <FormCheckbox name="terms" label="I agree to the Terms & Conditions" />

          <Button type="submit" loading={isSubmitting} disabled={!dirty || !isValid}>
            Register
          </Button>
        </Form>
      )}
    </Formik>
  );
}

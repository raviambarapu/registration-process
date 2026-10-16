import * as Yup from "yup";

const eighteenYearsAgo = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d;
};

export const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  course: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

export const registrationSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .min(2, "Minimum 2 characters")
    .max(30, "Maximum 30 characters")
    .matches(/^[A-Za-z\s]+$/, "Only letters are allowed")
    .required("First name is required"),

  lastName: Yup.string()
    .trim()
    .min(1, "Last name is required")
    .max(30, "Maximum 30 characters")
    .matches(/^[A-Za-z\s]+$/, "Only letters are allowed")
    .required("Last name is required"),

  email: Yup.string()
    .trim()
    .lowercase()
    .email("Enter a valid email address")
    .required("Email is required"),

  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number")
    .required("Phone number is required"),

  dob: Yup.date()
    .typeError("Enter a valid date")
    .max(eighteenYearsAgo(), "You must be at least 18 years old")
    .required("Date of birth is required"),

  gender: Yup.string()
    .oneOf(["male", "female", "other"], "Select a gender")
    .required("Gender is required"),

  course: Yup.string().required("Please select a course"),

  password: Yup.string()
    .min(8, "Minimum 8 characters")
    .matches(/[a-z]/, "Add at least one lowercase letter")
    .matches(/[A-Z]/, "Add at least one uppercase letter")
    .matches(/\d/, "Add at least one number")
    .matches(/[^A-Za-z0-9]/, "Add at least one special character")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm your password"),

  terms: Yup.boolean().oneOf([true], "You must accept the terms"),
});

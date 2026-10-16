import * as Yup from "yup";

export const loginInitialValues = {
  email: "",
  password: "",
};

export const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .lowercase()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

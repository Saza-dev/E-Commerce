import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Min 8 characters")
    .required("Password is required"),
});

export const registerSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Min 8 characters")
    .required("Password is required"),
  name: Yup.string().max(100, "Max 100 chars").optional(),
  phone: Yup.string().max(20, "Max 20 chars").optional(),
});

export const forgotSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export const resetSchema = Yup.object({
  token: Yup.string()
    .min(10, "Invalid token")
    .required("Reset token is required"),
  newPassword: Yup.string()
    .min(8, "Min 8 characters")
    .required("New password is required"),
  confirm: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your password"),
});

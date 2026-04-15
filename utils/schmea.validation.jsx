  import * as yup from "yup";
  export const registerSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });
  export const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  export const forgotPasswordSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
  });

  export const verifyOtpSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    otp: yup
      .string()
      .required("OTP is required")
      .matches(/^[0-9]{4,8}$/, "OTP must be 4-8 digits"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });
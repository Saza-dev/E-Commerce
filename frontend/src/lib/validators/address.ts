import * as Yup from "yup";

export const addressSchema = Yup.object({
  type: Yup.mixed<"SHIPPING" | "BILLING">()
    .oneOf(["SHIPPING", "BILLING"], "Choose SHIPPING or BILLING")
    .required("Type is required"),
  line1: Yup.string()
    .min(3, "Too short")
    .max(200)
    .required("Address line 1 is required"),
  line2: Yup.string().max(200).optional(),
  city: Yup.string().min(2, "Too short").max(100).required("City is required"),
  state: Yup.string().max(100).optional(),
  postalCode: Yup.string().max(20).optional(),
  country: Yup.string()
    .matches(/^[A-Za-z]{2,3}$/, "Use a 2–3 letter country code (e.g., LK, US)")
    .required("Country is required"),
  phone: Yup.string().max(20).optional(),
  isDefault: Yup.boolean().optional(),
});

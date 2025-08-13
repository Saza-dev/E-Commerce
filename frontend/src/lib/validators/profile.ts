import * as Yup from "yup";

export const profileSchema = Yup.object({
  name: Yup.string().max(100, "Max 100 chars").optional(),
  phone: Yup.string().max(20, "Max 20 chars").optional(),
  gender: Yup.mixed<"MALE" | "FEMALE" | "OTHER">()
    .oneOf(["MALE", "FEMALE", "OTHER"])
    .optional(),
  dateOfBirth: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
    .optional(),
  avatarUrl: Yup.string().url("Invalid URL").optional(),
  notes: Yup.string().max(1000, "Max 1000 chars").optional(),
});

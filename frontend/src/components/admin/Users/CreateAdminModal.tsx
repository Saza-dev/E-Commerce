"use client";

import Modal from "@/src/components/ui/modal";
import Button from "@/src/components/ui/button";
import { Input, Label } from "@/src/components/ui/input";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import FormError from "@/src/components/forms/FormError";
import { createAdmin } from "@/src/lib/api/admin";
import toast from "react-hot-toast";
import axios from "axios";

const schema = Yup.object({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(8, "Min 8 chars").required("Required"),
  name: Yup.string().max(100).optional(),
  phone: Yup.string().max(20).optional(),
});

export default function CreateAdminModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (user: any) => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Create Admin" footer={null}>
      <Formik
        initialValues={{ email: "", password: "", name: "", phone: "" }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const user = await createAdmin(values);
            toast.success("Admin created");
            onCreated(user);
            onClose();
          } catch (e: any) {
            const msg = axios.isAxiosError(e)
              ? (e.response?.data as any)?.message || e.message
              : "Failed";
            toast.error(Array.isArray(msg) ? msg.join(", ") : msg);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Field
                as={Input}
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
              />
              <FormError
                message={touched.email ? (errors.email as string) : undefined}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Field
                as={Input}
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
              />
              <FormError
                message={
                  touched.password ? (errors.password as string) : undefined
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Field
                  as={Input}
                  id="name"
                  name="name"
                  placeholder="Admin Name"
                />
                <FormError
                  message={touched.name ? (errors.name as string) : undefined}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Field
                  as={Input}
                  id="phone"
                  name="phone"
                  placeholder="070..."
                />
                <FormError
                  message={touched.phone ? (errors.phone as string) : undefined}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating…" : "Create"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

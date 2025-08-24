"use client";

import * as Yup from "yup";
import Modal from "../../ui/modal";
import { Field, Form, Formik } from "formik";
import { createCategory, updateCategory } from "@/src/lib/api/categories";
import type { Category } from "@/src/lib/api/categories";
import toast from "react-hot-toast";
import axios from "axios";
import { Input, Label } from "../../ui/input";
import FormError from "../../forms/FormError";
import Button from "../../ui/button";

const schema = Yup.object({
  name: Yup.string().max(100).required(),
  slug: Yup.string().max(100).required(),
  parentId: Yup.number().max(100).optional(),
});

export default function CreateCategory({
  open,
  onClose,
  onCreated,
  cat,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (category: any) => void;
  cat?: Category | null;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Create Admin" footer={null}>
      <Formik
        initialValues={{
          name: cat?.name || "",
          slug: cat?.slug || "",
          parentId: cat?.parentId || 0,
        }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            let category;
            if (!cat) {
              // Creating new category
              category = await createCategory(values);
              toast.success("Category Created");
            } else {
              // Updating existing category
              category = await updateCategory(cat.id.toString(), values);
              toast.success("Category Updated");
            }
            onCreated(category);
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
              <Label htmlFor="name">Category Name</Label>
              <Field
                as={Input}
                id="name"
                name="name"
                type="name"
                placeholder="Shorts"
              />
              <FormError
                message={touched.name ? (errors.name as string) : undefined}
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Field
                as={Input}
                id="slug"
                name="slug"
                type="slug"
                placeholder="Shorts"
              />
              <FormError
                message={touched.slug ? (errors.slug as string) : undefined}
              />
            </div>
            <div>
              <Label htmlFor="parentId">Category ID</Label>
              <Field
                as={Input}
                id="parentId"
                name="parentId"
                type="parentId"
                placeholder="1"
              />
              <FormError
                message={
                  touched.parentId ? (errors.parentId as string) : undefined
                }
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? cat
                    ? "Updating…"
                    : "Creating…"
                  : cat
                  ? "Update"
                  : "Create"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

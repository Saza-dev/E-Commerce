"use client";

import { Field, Form, Formik } from "formik";
import { addressSchema } from "@/src/lib/validators/address";
import { Input, Label } from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";
import FormError from "@/src/components/forms/FormError";
import clsx from "clsx";

export type AddressFormValues = {
  type: "SHIPPING" | "BILLING" | "";
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string; // 2–3 letters
  phone?: string;
  isDefault?: boolean;
};

export default function AddressForm({
  initialValues,
  onSubmit,
  submittingText = "Saving…",
  submitText = "Save",
}: {
  initialValues: AddressFormValues;
  onSubmit: (values: AddressFormValues) => Promise<void>;
  submittingText?: string;
  submitText?: string;
}) {
  return (
    <Formik<AddressFormValues>
      initialValues={initialValues}
      validationSchema={addressSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          // Ensure country is uppercase (UI hint only)
          const v = { ...values, country: values.country?.toUpperCase() };
          await onSubmit(v);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Field
                as="select"
                id="type"
                name="type"
                className={clsx(
                  "w-full rounded-xl border border-gray-300 px-3 py-2",
                  "focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                )}
              >
                <option value="">Select…</option>
                <option value="SHIPPING">Shipping</option>
                <option value="BILLING">Billing</option>
              </Field>
              <FormError
                message={touched.type ? (errors.type as string) : undefined}
              />
            </div>

            <div className="flex items-end">
              <label className="inline-flex items-center gap-2">
                <Field type="checkbox" name="isDefault" />
                <span className="text-sm text-gray-700">Set as default</span>
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="line1">Address line 1</Label>
            <Field
              as={Input}
              id="line1"
              name="line1"
              placeholder="No. 12, Main Street"
            />
            <FormError
              message={touched.line1 ? (errors.line1 as string) : undefined}
            />
          </div>

          <div>
            <Label htmlFor="line2">Address line 2 (optional)</Label>
            <Field
              as={Input}
              id="line2"
              name="line2"
              placeholder="Apartment / Suite"
            />
            <FormError
              message={touched.line2 ? (errors.line2 as string) : undefined}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Field as={Input} id="city" name="city" placeholder="Colombo" />
              <FormError
                message={touched.city ? (errors.city as string) : undefined}
              />
            </div>
            <div>
              <Label htmlFor="state">State/Province</Label>
              <Field as={Input} id="state" name="state" placeholder="Western" />
              <FormError
                message={touched.state ? (errors.state as string) : undefined}
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Field
                as={Input}
                id="postalCode"
                name="postalCode"
                placeholder="00100"
              />
              <FormError
                message={
                  touched.postalCode ? (errors.postalCode as string) : undefined
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country">Country (code)</Label>
              <Field as={Input} id="country" name="country" placeholder="LK" />
              <FormError
                message={
                  touched.country ? (errors.country as string) : undefined
                }
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Field
                as={Input}
                id="phone"
                name="phone"
                placeholder="0771234567"
              />
              <FormError
                message={touched.phone ? (errors.phone as string) : undefined}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? submittingText : submitText}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

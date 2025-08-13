"use client";

import Card from "@/src/components/ui/card";
import Button from "@/src/components/ui/button";
import { Input, Label } from "@/src/components/ui/input";
import { Formik, Form, Field } from "formik";
import { resetSchema } from "@/src/lib/validators/auth";
import { resetPassword } from "@/src/lib/api/auth";
import FormError from "@/src/components/forms/FormError";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";

type Values = { token: string; newPassword: string; confirm: string };

export default function ResetPasswordPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const [initialToken, setInitialToken] = useState<string>("");

  useEffect(() => {
    const t = sp.get("token");
    if (t) setInitialToken(t);
  }, [sp]);

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="p-6">
        <h1 className="text-lg font-semibold">Reset password</h1>
        <p className="text-gray-600">
          Paste your reset token and choose a new password.
        </p>

        <Formik<Values>
          enableReinitialize
          initialValues={{ token: initialToken, newPassword: "", confirm: "" }}
          validationSchema={resetSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await resetPassword(values.token, values.newPassword);
              toast.success("Password updated. Please sign in.");
              router.replace("/auth/login");
            } catch (err) {
              const msg = axios.isAxiosError(err)
                ? (err.response?.data as any)?.message || err.message
                : "Reset failed";
              toast.error(Array.isArray(msg) ? msg.join(", ") : msg);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="mt-6 space-y-5">
              <div>
                <Label htmlFor="token">Reset token</Label>
                <Field
                  as={Input}
                  id="token"
                  name="token"
                  placeholder="paste token here"
                />
                <FormError
                  message={touched.token ? (errors.token as string) : undefined}
                />
              </div>

              <div>
                <Label htmlFor="newPassword">New password</Label>
                <Field
                  as={Input}
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="••••••••"
                />
                <FormError
                  message={
                    touched.newPassword
                      ? (errors.newPassword as string)
                      : undefined
                  }
                />
              </div>

              <div>
                <Label htmlFor="confirm">Confirm password</Label>
                <Field
                  as={Input}
                  id="confirm"
                  name="confirm"
                  type="password"
                  placeholder="••••••••"
                />
                <FormError
                  message={
                    touched.confirm ? (errors.confirm as string) : undefined
                  }
                />
              </div>

              <div className="flex items-center justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating…" : "Update password"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
}

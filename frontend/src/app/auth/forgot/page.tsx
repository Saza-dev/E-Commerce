"use client";

import Card from "@/src/components/ui/card";
import Button from "@/src/components/ui/button";
import { Input, Label } from "@/src/components/ui/input";
import { Formik, Form, Field } from "formik";
import { forgotSchema } from "@/src/lib/validators/auth";
import { requestPasswordReset } from "@/src/lib/api/auth";
import FormError from "@/src/components/forms/FormError";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";

type Values = { email: string };

export default function ForgotPasswordPage() {
  const [serverMsg, setServerMsg] = useState<string>();
  const [testToken, setTestToken] = useState<string>(); // backend returns this for testing

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="p-6">
        <h1 className="text-lg font-semibold">Forgot password</h1>
        <p className="text-gray-600">
          Enter your account email. If it exists, we’ll generate a reset link.
        </p>

        <Formik<Values>
          initialValues={{ email: "" }}
          validationSchema={forgotSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setServerMsg(undefined);
            setTestToken(undefined);
            try {
              const res = await requestPasswordReset(values.email);
              toast.success(
                "If that email exists, a reset link has been sent."
              );
              setServerMsg("If that email exists, a reset link has been sent.");
              if (res?.resetToken) setTestToken(res.resetToken); // for local testing only
            } catch (err) {
              const msg = axios.isAxiosError(err)
                ? (err.response?.data as any)?.message || err.message
                : "Request failed";
              setServerMsg(Array.isArray(msg) ? msg.join(", ") : msg);
              toast.error("Could not request reset");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="mt-6 space-y-5">
              <div>
                <Label htmlFor="email">Email</Label>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                />
                <FormError
                  message={touched.email ? (errors.email as string) : undefined}
                />
              </div>

              {serverMsg && (
                <p className="text-sm text-gray-700">{serverMsg}</p>
              )}

              <div className="flex items-center justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending…" : "Send reset link"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>

        {testToken && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
            <div className="font-semibold text-amber-800">Dev note</div>
            <p className="mt-1 text-amber-900">
              Your backend returns the reset token for testing:
            </p>
            <pre className="mt-2 overflow-auto rounded-lg bg-white p-2 text-xs border">
              {testToken}
            </pre>
            <p className="mt-2">
              Use it on{" "}
              <a
                className="underline"
                href={`/auth/reset?token=${encodeURIComponent(testToken)}`}
              >
                /auth/reset
              </a>
              .
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

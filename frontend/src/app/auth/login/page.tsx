"use client";

import Card from "@/src/components/ui/card";
import Button from "@/src/components/ui/button";
import { Input, Label } from "@/src/components/ui/input";
import PasswordInput from "@/src/components/ui/password-input";
import { Formik, Form, Field } from "formik";
import { loginSchema } from "@/src/lib/validators/auth";
import { useAuth } from "@/src/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import FormError from "@/src/components/forms/FormError";
import axios from "axios";

type LoginValues = { email: string; password: string };

export default function LoginPage() {
  const { authenticated, login } = useAuth();
  const router = useRouter();
  const sp = useSearchParams();
  const [formError, setFormError] = useState<string>();

  useEffect(() => {
    if (authenticated) router.replace("/");
  }, [authenticated, router]);

  const initialValues: LoginValues = { email: "", password: "" };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="p-6">
        <h1 className="text-lg font-semibold">Login</h1>
        <p className="text-gray-600">Use your account credentials.</p>

        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setFormError(undefined);
            try {
              await login(values.email, values.password);
              toast.success("Logged in!");
              const next = sp.get("next") || "/";
              router.replace(next);
            } catch (err: any) {
              // Try to extract a helpful message
              const msg = axios.isAxiosError(err)
                ? (err.response?.data as any)?.message || err.message
                : "Login failed";
              setFormError(Array.isArray(msg) ? msg.join(", ") : msg);
              toast.error("Login failed");
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

              <div>
                <Label htmlFor="password">Password</Label>
                <Field
                  as={PasswordInput}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                />
                <FormError
                  message={
                    touched.password ? (errors.password as string) : undefined
                  }
                />
              </div>

              <FormError message={formError} />

              <div className="flex items-center justify-between">
                <a
                  className="text-sm text-gray-600 hover:underline"
                  href="/auth/forgot"
                >
                  Forgot password?
                </a>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
}

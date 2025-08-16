"use client";

import Card from "@/src/components/ui/card";
import Button from "@/src/components/ui/button";
import { Input, Label } from "@/src/components/ui/input";
import PasswordInput from "@/src/components/ui/password-input";
import { Formik, Form, Field } from "formik";
import { registerSchema } from "@/src/lib/validators/auth";
import { useAuth } from "@/src/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import FormError from "@/src/components/forms/FormError";
import axios from "axios";

type RegisterValues = {
  email: string;
  password: string;
  name?: string;
  phone?: string;
};

export default function RegisterPage() {
  const { authenticated, register } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState<string>();

  useEffect(() => {
    if (authenticated) router.replace("/");
  }, [authenticated, router]);

  const initialValues: RegisterValues = {
    email: "",
    password: "",
    name: "",
    phone: "",
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="p-6">
        <h1 className="text-lg font-semibold">Create your account</h1>
        <p className="text-gray-600">Register as a customer.</p>

        <Formik
          initialValues={initialValues}
          validationSchema={registerSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setFormError(undefined);
            try {
              await register(values);
              toast.success("Account created!");
              router.replace("/");
            } catch (err: any) {
              const msg = axios.isAxiosError(err)
                ? (err.response?.data as any)?.message || err.message
                : "Registration failed";
              setFormError(Array.isArray(msg) ? msg.join(", ") : msg);
              toast.error("Registration failed");
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name (optional)</Label>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    placeholder="John Doe"
                  />
                  <FormError
                    message={touched.name ? (errors.name as string) : undefined}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Field
                    as={Input}
                    id="phone"
                    name="phone"
                    placeholder="0771234567"
                  />
                  <FormError
                    message={
                      touched.phone ? (errors.phone as string) : undefined
                    }
                  />
                </div>
              </div>

              <FormError message={formError} />

              <div className="flex items-center justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create account"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
}

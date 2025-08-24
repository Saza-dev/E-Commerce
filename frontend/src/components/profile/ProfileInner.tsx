"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/src/components/ui/card";
import Button from "@/src/components/ui/button";
import { Input, Label } from "@/src/components/ui/input";
import { Formik, Form, Field } from "formik";
import { profileSchema } from "@/src/lib/validators/profile";
import { getProfile, updateProfile, ProfileDTO } from "@/src/lib/api/profile";
import toast from "react-hot-toast";
import FormError from "@/src/components/forms/FormError";
import { useAuth } from "@/src/contexts/AuthContext";
import clsx from "clsx";

type FormValues = {
  name?: string;
  phone?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | "";
  dateOfBirth?: string; // YYYY-MM-DD
  avatarUrl?: string;
  notes?: string;
};

export default function ProfileInner() {
  const { user, refreshFromStorage } = useAuth();
  const [loading, setLoading] = useState(true);
  const [initial, setInitial] = useState<FormValues>({
    name: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    avatarUrl: "",
    notes: "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getProfile();
        const u = data.user ?? {};
        const p = data.profile ?? {};
        const dob = p.dateOfBirth ? new Date(p.dateOfBirth) : null;
        const iso = dob ? String(dob.toISOString().slice(0, 10)) : "";
        if (!cancelled) {
          setInitial({
            name: u.name || "",
            phone: u.phone || "",
            gender: p.gender || "",
            dateOfBirth: iso,
            avatarUrl: p.avatarUrl || "",
            notes: p.notes || "",
          });
        }
      } catch {
        toast.error("Failed to load profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const title = useMemo(
    () => (user?.email ? `Profile — ${user.email}` : "Profile"),
    [user?.email]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="p-6">
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="mt-4 text-sm text-gray-500">Loading…</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="p-6">
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="text-gray-600">
          Update your profile and basic account info.
        </p>

        <Formik<FormValues>
          enableReinitialize
          initialValues={initial}
          validationSchema={profileSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const dto: ProfileDTO = {
                name: values.name || undefined,
                phone: values.phone || undefined,
                gender: values.gender ? (values.gender as any) : undefined,
                dateOfBirth: values.dateOfBirth || undefined,
                avatarUrl: values.avatarUrl || undefined,
                notes: values.notes || undefined,
              };
              const res = await updateProfile(dto);
              // Backend returns { user, profile }. Persist user -> localStorage, then sync context.
              const { setUser } = await import("@/src/lib/auth/tokens");
              setUser(res.user);
              refreshFromStorage();
              toast.success("Profile updated");
            } catch (err: any) {
              const msg =
                (err?.response?.data?.message as string) ||
                err?.message ||
                "Update failed";
              toast.error(msg);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="mt-6 space-y-5">
              {/* Name / Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
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
                  <Label htmlFor="phone">Phone</Label>
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

              {/* Gender / DOB */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Field
                    as="select"
                    id="gender"
                    name="gender"
                    className={clsx(
                      "w-full rounded-xl border border-gray-300 px-3 py-2",
                      "focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                    )}
                  >
                    <option value="">Select…</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </Field>
                  <FormError
                    message={
                      touched.gender ? (errors.gender as string) : undefined
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Field
                    as={Input}
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                  />
                  <FormError
                    message={
                      touched.dateOfBirth
                        ? (errors.dateOfBirth as string)
                        : undefined
                    }
                  />
                </div>
              </div>

              {/* Avatar / Notes */}
              <div>
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Field
                  as={Input}
                  id="avatarUrl"
                  name="avatarUrl"
                  placeholder="https://…"
                />
                <FormError
                  message={
                    touched.avatarUrl ? (errors.avatarUrl as string) : undefined
                  }
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Field
                  as="textarea"
                  id="notes"
                  name="notes"
                  rows={4}
                  className={clsx(
                    "w-full rounded-xl border border-gray-300 px-3 py-2",
                    "focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                  )}
                  placeholder="Anything you want to keep for your profile…"
                />
                <FormError
                  message={touched.notes ? (errors.notes as string) : undefined}
                />
              </div>

              <div className="flex items-center justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
}

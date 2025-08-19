"use client";

import Button from "@/src/components/ui/button";
import { Input, Label } from "@/src/components/ui/input";
import { type Category, listCategoriesAdmin } from "@/src/lib/api/categories";
import { type Product, updateProduct } from "@/src/lib/api/products";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ProductInfoForm({ product }: { product: Product }) {
  const [categories, setCategories] = useState<Category[]>([]);

  // loading dataset function
  const load = async () => {
    try {
      const data = await listCategoriesAdmin();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  // loading dataset on load
  useEffect(() => {
    load();
  }, []);

  return (
    <Formik
      initialValues={{
        name: product.name,
        slug: product.slug,
        description: product.description,
        categoryId: product.categoryId,
      }}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await updateProduct(product.id, values);
          toast.success("Product updated");
        } catch {
          toast.error("Failed to update product");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Field as={Input} id="name" name="name" />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Field as={Input} id="slug" name="slug" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Field as={Input} id="description" name="description" />
          </div>
          <div>
            <Label htmlFor="categoryId">Category</Label>
            <Field
              as="select"
              id="categoryId"
              name="categoryId"
              className=" border border-gray-300 rounded-[10px] p-2 w-full"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Field>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            Save Product Info
          </Button>
        </Form>
      )}
    </Formik>
  );
}

"use client";

import * as Yup from "yup";
import { Field, FieldArray, Form, Formik } from "formik";
import { createProduct } from "@/src/lib/api/products";
import toast from "react-hot-toast";
import { Input, Label } from "../../ui/input";
import FormError from "../../forms/FormError";
import Button from "../../ui/button";
import { useRouter } from "next/navigation";
import { type Category, listCategoriesAdmin } from "@/src/lib/api/categories";
import { useEffect, useState } from "react";

const variantSchema = Yup.object({
  size: Yup.string().required(),
  color: Yup.string().required(),
  price: Yup.number().required().min(0),
  quantity: Yup.number().required().min(0),
  status: Yup.string().required(),
  images: Yup.array().of(Yup.object({ url: Yup.string().url().required() })),
});

const schema = Yup.object({
  name: Yup.string().required(),
  slug: Yup.string().required(),
  description: Yup.string().required(),
  categoryId: Yup.number().required(),
  variants: Yup.array()
    .of(variantSchema)
    .min(1, "At least one variant required"),
});

export default function AddProduct() {
  const [categories, setCategories] = useState<Category[]>([]);

  const router = useRouter();

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
        name: "",
        slug: "",
        description: "",
        categoryId: 0,
        variants: [
          {
            size: "",
            color: "",
            price: 0,
            quantity: 0,
            status: "IN_STOCK",
            images: [{ url: "" }],
          },
        ],
      }}
      validationSchema={schema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const payload = {
            ...values,
            variants: values.variants.map((v) => ({
              ...v,
              status: v.status as "IN_STOCK" | "PRE_ORDER" | "OUT_OF_STOCK",
              images: v.images.map((img) => img.url),
            })),
          };
          const product = await createProduct(payload);
          if (product) {
            toast.success("Product Created");
            router.push("/admin/products");
          } else {
            toast.error("Failed to create product");
          }
        } catch (e: any) {
          toast.error("Failed to create product");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, errors, touched, isSubmitting }) => (
        <Form className="space-y-4">
          {/* Basic product info */}
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Field as={Input} id="name" name="name" />
            <FormError
              message={touched.name ? (errors.name as string) : undefined}
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Field as={Input} id="slug" name="slug" />
            <FormError
              message={touched.slug ? (errors.slug as string) : undefined}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Field as={Input} id="description" name="description" />
            <FormError
              message={
                touched.description ? (errors.description as string) : undefined
              }
            />
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
            <FormError
              message={
                touched.categoryId ? (errors.categoryId as string) : undefined
              }
            />
          </div>

          {/* Variants */}
          <FieldArray name="variants">
            {({ push, remove }) => (
              <div>
                <h3 className="font-bold mt-4">Variants</h3>
                {values.variants.map((variant, index) => (
                  <div key={index} className="p-2 my-2">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => remove(index)}
                      >
                        Remove Variant
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-5 items-center">
                      <div>
                        <Label>Size</Label>
                        <Field as={Input} name={`variants.${index}.size`} />
                      </div>
                      <div>
                        <Label>Color</Label>
                        <Field as={Input} name={`variants.${index}.color`} />
                      </div>
                      <div>
                        <Label>Price</Label>
                        <Field
                          as={Input}
                          name={`variants.${index}.price`}
                          type="number"
                        />
                      </div>
                      <div>
                        <Label>Qty</Label>
                        <Field
                          as={Input}
                          name={`variants.${index}.quantity`}
                          type="number"
                        />
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Field
                          as="select"
                          name={`variants.${index}.status`}
                          className="border border-gray-300 rounded-[10px] p-2 w-full"
                        >
                          <option value="IN_STOCK">IN_STOCK</option>
                          <option value="PRE_ORDER">PRE_ORDER</option>
                          <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
                        </Field>
                      </div>
                    </div>

                    {/* Images */}
                    <FieldArray name={`variants.${index}.images`}>
                      {({ push: pushImage, remove: removeImage }) => (
                        <div className="ml-4 mt-2 flex-col flex gap-4">
                          <h4>Images</h4>
                          {variant.images.map((img, imgIndex) => (
                            <div
                              key={imgIndex}
                              className="flex gap-2 items-center"
                            >
                              <Field
                                as={Input}
                                name={`variants.${index}.images.${imgIndex}.url`}
                                placeholder="Image URL"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => removeImage(imgIndex)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                          <div className="mt-4">
                            <Button
                              type="button"
                              onClick={() => pushImage({ url: "" })}
                            >
                              Add Image
                            </Button>
                          </div>
                        </div>
                      )}
                    </FieldArray>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() =>
                    push({
                      size: "",
                      color: "",
                      price: 0,
                      quantity: 0,
                      status: "IN_STOCK",
                      images: [{ url: "" }],
                    })
                  }
                >
                  Add Variant
                </Button>
              </div>
            )}
          </FieldArray>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating…" : "Create"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

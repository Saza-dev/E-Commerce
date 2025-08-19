import Button from "@/src/components/ui/button";
import { Field, FieldArray, Form, Formik } from "formik";
import { Input, Label } from "@/src/components/ui/input";
import * as Yup from "yup";
import { createVariant } from "@/src/lib/api/variants";
import toast from "react-hot-toast";

const variantSchema = Yup.object({
  productId: Yup.number().required("Product ID is required").min(1),
  size: Yup.string().required("Size is required"),
  color: Yup.string().required("Color is required"),
  price: Yup.number().required("Price is required").min(0),
  quantity: Yup.number().required("Quantity is required").min(0),
  status: Yup.string().required("Status is required"),
  images: Yup.array().of(
    Yup.string().url("Must be a valid URL").required("Image URL is required")
  ),
});

interface AddVariantProps {
  productId: number;
  onVariantAdded?: (variant: any) => void;
}

export default function AddVariant({
  productId,
  onVariantAdded,
}: AddVariantProps) {
  return (
    <Formik
      initialValues={{
        productId: productId,
        size: "",
        color: "",
        price: 0,
        quantity: 0,
        status: "IN_STOCK" as "IN_STOCK" | "PRE_ORDER" | "OUT_OF_STOCK",
        images: [""],
      }}
      validationSchema={variantSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          const payload = {
            productId: productId,
            size: values.size,
            color: values.color,
            price: values.price,
            quantity: values.quantity,
            status: values.status,
            images: values.images.filter((url) => url.trim() !== ""),
          };

          console.log(payload);
          const variant = await createVariant(payload);
          if (variant) {
            toast.success("Variant Created Successfully");
            resetForm();
            onVariantAdded?.(variant);
          } else {
            toast.error("Failed to create variant");
          }
        } catch (e: any) {
          toast.error(e?.message || "Failed to create variant");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, errors, touched, isSubmitting }) => (
        <Form>
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Add Variant</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Size</Label>
                <Field as={Input} name="size" />
                {errors.size && touched.size && (
                  <div className="text-red-500 text-sm mt-1">{errors.size}</div>
                )}
              </div>

              <div>
                <Label>Color</Label>
                <Field as={Input} name="color" />
                {errors.color && touched.color && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.color}
                  </div>
                )}
              </div>

              <div>
                <Label>Price</Label>
                <Field as={Input} name="price" type="number" step="0.01" />
                {errors.price && touched.price && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.price}
                  </div>
                )}
              </div>

              <div>
                <Label>Quantity</Label>
                <Field as={Input} name="quantity" type="number" />
                {errors.quantity && touched.quantity && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.quantity}
                  </div>
                )}
              </div>

              <div>
                <Label>Status</Label>
                <Field
                  as="select"
                  name="status"
                  className="border border-gray-300 rounded-[10px] p-2 w-full"
                >
                  <option value="IN_STOCK">IN_STOCK</option>
                  <option value="PRE_ORDER">PRE_ORDER</option>
                  <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
                </Field>
                {errors.status && touched.status && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.status}
                  </div>
                )}
              </div>
            </div>

            {/* Images */}
            <div>
              <FieldArray name="images">
                {({ push, remove }) => (
                  <div className="space-y-2">
                    <h4 className="font-medium">Images</h4>
                    {values.images.map((image, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Field
                          as={Input}
                          name={`images.${index}`}
                          placeholder="Image URL"
                          className="flex-1"
                        />
                        {values.images.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => remove(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    {errors.images && touched.images && (
                      <div className="text-red-500 text-sm">
                        {errors.images}
                      </div>
                    )}
                    <Button type="button" onClick={() => push("")}>
                      Add Image
                    </Button>
                  </div>
                )}
              </FieldArray>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating…" : "Create Variant"}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

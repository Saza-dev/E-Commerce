import Button from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import type { Variant } from "@/src/lib/api/products";
import { Field, FieldArray, Form, Formik } from "formik";

export default function VariantForm({
  productId,
  variant,
  onUpdate,
}: //   onDelete,
{
  productId: number;
  variant: Variant;
  onUpdate: (
    productId: number,
    variantId: number,
    data: {
      size?: string;
      color?: string;
      price?: number;
      quantity?: number;
      status?: "IN_STOCK" | "PRE_ORDER" | "OUT_OF_STOCK";
      images?: string[];
    }
  ) => void;
  //   onDelete: (id: number) => void;
}) {
  return (
    <Formik
      initialValues={{
        size: variant.size,
        color: variant.color,
        price: variant.price,
        quantity: variant.quantity,
        status: variant.status,
        images: variant.images || [],
      }}
      onSubmit={(values) =>
        onUpdate(productId, variant.id, {
          ...values,
          images: values.images.map((img) => img.url), 
        }
      )
      }
    >
      {({ values }) => (
        <Form className="border p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Field as={Input} name="size" placeholder="Size" />
            <Field as={Input} name="color" placeholder="Color" />
            <Field as={Input} name="price" type="number" placeholder="Price" />
            <Field
              as={Input}
              name="quantity"
              type="number"
              placeholder="Quantity"
            />
            <Field as="select" name="status" className="border p-2">
              <option value="IN_STOCK">IN_STOCK</option>
              <option value="PRE_ORDER">PRE_ORDER</option>
              <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
            </Field>
          </div>

          {/* Image FieldArray */}
          <FieldArray name="images">
            {({ push, remove }) => (
              <div className="mt-4 flex flex-col gap-4">
                <h4 className="font-medium">Images</h4>

                {values.images.map((img, imgIndex) => (
                  <div key={imgIndex} className="flex gap-2 items-center">
                    <Field
                      as={Input}
                      name={`images.${imgIndex}.url`}
                      placeholder="Image URL"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => remove(imgIndex)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                <Button type="button" onClick={() => push({ url: "" })}>
                  Add Image
                </Button>
              </div>
            )}
          </FieldArray>

          <div className="flex gap-2 justify-end">
            <Button type="submit">Save</Button>
            {/* <Button type="button" onClick={() => onDelete(variant.id)}>
              Delete
            </Button> */}
          </div>
        </Form>
      )}
    </Formik>
  );
}

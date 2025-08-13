"use client";

import {
  DressStyle,
  Gender,
  type Brand,
  type Category,
  type Color,
  type Size,
} from "@prisma/client";
import * as z from "zod";
import {
  FormProvider,
  useFieldArray,
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Plus, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import "react-quill-new/dist/quill.snow.css";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form-input";
import { FormError } from "@/components/form-error";
import { FormSelect } from "@/components/form-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { createProductSchema } from "@/schemas";
import { createProduct } from "@/actions/product.actions";
import { DRESS_STYLE_LIST, GENDER_LIST } from "@/constants";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface CreateProductFormProps {
  brands: Brand[];
  categories: Category[];
  colors: Color[];
  sizes: Size[];
}

const CreateProductForm = ({
  brands,
  categories,
  colors,
  sizes,
}: CreateProductFormProps) => {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | undefined>("");
  const [imagePreviews, setImagePreviews] = useState<
    { url: string; isMain: boolean }[]
  >([]);

  const form = useForm<z.infer<typeof createProductSchema>>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      sku: "",
      description: "",
      dressStyle: DressStyle.CASUAL,
      categoryId: "",
      brandId: "",
      gender: Gender.MALE,
      variants: [],
    },
  });

  const {
    control,
    watch,
    formState: { isSubmitting },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const onSubmit: SubmitHandler<z.infer<typeof createProductSchema>> = (
    values
  ) => {
    setError("");

    const fd = new FormData();

    // Додаємо зображення
    imageFiles.forEach((file, idx) => {
      fd.append("images", file);
      const isMain = imagePreviews[idx]?.isMain ? "true" : "false";
      fd.append(`isMain-${idx}`, isMain);
    });

    // Додаємо всі значення форми в одному полі "json"
    fd.append(
      "json",
      JSON.stringify({
        ...values,
        description: content,
      })
    );

    startTransition(() => {
      createProduct(fd).then((data) => {
        if (data?.error) {
          setError(data.error);
        } else {
          toast.success(data.success);
          router.push("/products");
        }
      });
    });
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 5);
    setImageFiles(files);

    Promise.all(
      files.map(
        (file) =>
          new Promise<{ url: string; isMain: boolean }>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () =>
              resolve({ url: reader.result as string, isMain: false });
            reader.readAsDataURL(file);
          })
      )
    ).then((arr) => {
      if (arr.length > 0 && arr[0]) {
        arr[0].isMain = true;
      }
      setImagePreviews(arr);
    });
  };

  return (
    <Card className="w-full max-w-6xl py-10 px-5 h-fit">
      <CardHeader>
        <CardTitle className="text-center uppercase font-bold text-lg">
          Add a new product
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-4 gap-5"
          >
            <FormInput
              id="name"
              name="name"
              label="Product name"
              placeholder="For example: Skinny fit jeans"
              disabled={isPending || isSubmitting}
              required
              className="col-span-3"
            />
            <FormInput
              id="sku"
              name="sku"
              label="Sku code"
              placeholder="For example: 1001"
              disabled={isPending || isSubmitting}
              required
              className="col-span-1"
            />
            <FormSelect
              id="categoryId"
              name="categoryId"
              label="Category name"
              options={categories.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
              required
              disabled={isPending || isSubmitting}
            />
            <FormSelect
              id="brandId"
              name="brandId"
              label="Brand name"
              options={brands.map((b) => ({
                value: b.id,
                label: b.name,
              }))}
              required
              disabled={isPending || isSubmitting}
            />
            <FormSelect
              id="dressStyle"
              name="dressStyle"
              label="Dress Style"
              options={DRESS_STYLE_LIST.map((ds) => ({
                value: ds.value,
                label: ds.name,
              }))}
              required
              disabled={isPending || isSubmitting}
            />
            <FormSelect
              id="gender"
              name="gender"
              label="Gender"
              options={GENDER_LIST.map((g) => ({
                value: g.value,
                label: g.name,
              }))}
              required
              disabled={isPending || isSubmitting}
            />

            <div className="col-span-4 grid grid-cols-2 gap-5 mb-10">
              <div className="space-y-2">
                <Label>Images (max 5)</Label>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={isPending || isSubmitting}
                  onChange={onFileChange}
                />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {imagePreviews.map((img, i) => (
                    <div key={i} className="relative border p-2">
                      <Image
                        src={img.url}
                        width={300}
                        height={200}
                        alt=""
                        className="object-contain"
                      />
                      <label className="flex items-center mt-2">
                        <input
                          type="radio"
                          checked={img.isMain}
                          onChange={() =>
                            setImagePreviews((prev) =>
                              prev.map((p, idx) => ({
                                ...p,
                                isMain: idx === i,
                              }))
                            )
                          }
                        />
                        <span className="ml-2">Main</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Product description</Label>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  className="h-48"
                />
              </div>
            </div>

            <div className="col-span-4 space-y-2">
              <div className="flex items-center justify-between">
                <Label>Product variants</Label>
                <Button
                  size="icon"
                  type="button"
                  variant="outline"
                  title="Add new product variant"
                  aria-label="Add new product variant"
                  onClick={() =>
                    append({
                      colorId: "",
                      sizeId: "",
                      quantity: 0,
                      price: 0,
                      discount: 0,
                    })
                  }
                  disabled={isPending || isSubmitting}
                  className="cursor-pointer"
                >
                  <Plus />
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[repeat(5,minmax(0,1fr))_auto] gap-3 items-end"
                >
                  <FormSelect
                    id={`variants.${index}.colorId`}
                    name={`variants.${index}.colorId`}
                    label="Color"
                    options={colors.map((c) => ({
                      value: c.id,
                      label: c.name,
                    }))}
                    required
                    disabled={isPending || isSubmitting}
                  />
                  <FormSelect
                    id={`variants.${index}.sizeId`}
                    name={`variants.${index}.sizeId`}
                    label="Size"
                    options={sizes.map((s) => ({
                      value: s.id,
                      label: s.name,
                    }))}
                    required
                    disabled={isPending || isSubmitting}
                  />
                  <FormInput
                    id={`variants.${index}.quantity`}
                    name={`variants.${index}.quantity`}
                    label="Quantity"
                    placeholder="5"
                    required
                    disabled={isPending}
                    type="number"
                  />
                  <FormInput
                    id={`variants.${index}.price`}
                    name={`variants.${index}.price`}
                    label="Price"
                    placeholder="49.99"
                    required
                    disabled={isPending || isSubmitting}
                    type="number"
                  />
                  <FormInput
                    id={`variants.${index}.discount`}
                    name={`variants.${index}.discount`}
                    label="Discount %"
                    placeholder="20"
                    required
                    disabled={isPending || isSubmitting}
                    type="number"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => remove(index)}
                    disabled={isPending || isSubmitting}
                    title="Delete variant"
                    aria-label="Delete variant"
                  >
                    <XIcon />
                  </Button>
                </div>
              ))}
            </div>

            {error && (
              <div role="alert" aria-live="polite" aria-atomic="true">
                <FormError message={error} />
              </div>
            )}

            <div className="flex gap-5 mt-10">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending || isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || isSubmitting}
                className="flex-1"
              >
                {isPending || isSubmitting ? "Adding..." : "Add product"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default CreateProductForm;

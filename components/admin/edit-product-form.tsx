"use client";

import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import "react-quill-new/dist/quill.snow.css";
import { Minus, Plus, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { Brand, Category, Color, Prisma, Size } from "@prisma/client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form-input";
import { FormError } from "@/components/form-error";
import { FormSelect } from "@/components/form-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { editProductSchema } from "@/schemas";
import { editProduct } from "@/actions/product.actions";
import { DRESS_STYLE_LIST, GENDER_LIST } from "@/constants";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface EditProductFormProps {
  product: Prisma.ProductGetPayload<{
    include: {
      brand: true;
      category: true;
      images: true;
      variants: true;
    };
  }>;
  brands: Brand[];
  categories: Category[];
  colors: Color[];
  sizes: Size[];
}

export const EditProductForm = ({
  product,
  brands,
  categories,
  colors,
  sizes,
}: EditProductFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | undefined>("");
  const [content, setContent] = useState(product.description);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState(product.images ?? []);
  const [variantToRemoveIndex, setVariantToRemoveIndex] = useState<
    number | null
  >(null);
  const [mainImagePublicId, setMainImagePublicId] = useState(
    existingImages.find((img) => img.isMain)?.publicId ?? ""
  );
  const [imagePreviews, setImagePreviews] = useState<
    { url: string; isMain: boolean }[]
  >([]);

  const form = useForm<z.infer<typeof editProductSchema>>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      productId: product.id,
      name: product.name,
      sku: product.sku,
      categoryId: product.categoryId,
      brandId: product.brandId,
      gender: product.gender,
      dressStyle: product.dressStyle,
      description: product.description,
      variants: product.variants.map((v) => ({
        id: v.id,
        colorId: v.colorId,
        sizeId: v.sizeId,
        quantity: v.quantity,
        price: v.price,
        discount: v.discount,
        discountedPrice: v.discountedPrice,
      })),
    },
  });

  const { control, setValue, handleSubmit } = form;

  const variants = useWatch({ control, name: "variants" });

  useEffect(() => {
    const mainImg = existingImages.find((img) => img.isMain)?.publicId ?? "";
    setMainImagePublicId(mainImg);
  }, [existingImages]);

  useEffect(() => {
    variants.forEach((variant, index) => {
      const price = variant.price ?? 0;
      const discount = variant.discount ?? 0;
      const discountedPrice = Number((price * (1 - discount / 100)).toFixed(2));

      if (variant.discountedPrice !== discountedPrice) {
        setValue(`variants.${index}.discountedPrice`, discountedPrice, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    });
  }, [variants, setValue]);

  const variantsFieldArray = useFieldArray({
    control,
    name: "variants",
  });

  const setMainNewImage = (index: number) => {
    setImagePreviews((prev) =>
      prev.map((img, i) => ({
        ...img,
        isMain: i === index,
      }))
    );
    setExistingImages((prev) => prev.map((img) => ({ ...img, isMain: false })));
  };

  const setMainExistingImage = (publicId: string) => {
    setExistingImages((prev) =>
      prev.map((img) => ({
        ...img,
        isMain: img.publicId === publicId,
      }))
    );
    setImagePreviews((prev) => prev.map((img) => ({ ...img, isMain: false })));
  };

  const removeExistingImage = (publicId: string) => {
    setExistingImages((prev) => {
      const isRemovingMain = prev.find(
        (img) => img.publicId === publicId
      )?.isMain;

      const filtered = prev.filter((img) => img.publicId !== publicId);

      if (isRemovingMain && filtered.length > 0) {
        return filtered.map((img, idx) => ({
          ...img,
          isMain: idx === 0,
        }));
      }

      return filtered;
    });

    setImagesToDelete((prev) => [...prev, publicId]);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files).slice(0, 5) : [];
    setImageFiles(files);

    Promise.all(
      files.map(
        (f) =>
          new Promise<{ url: string; isMain: boolean }>((res) => {
            const r = new FileReader();
            r.onloadend = () => res({ url: r.result as string, isMain: false });
            r.readAsDataURL(f);
          })
      )
    ).then((newPreviews) => {
      if (!existingImages.some((img) => img.isMain) && newPreviews.length > 0) {
        if (newPreviews[0]) {
          newPreviews[0].isMain = true;
        }
      }
      setImagePreviews(newPreviews);
    });
  };

  const onSubmit = (data: z.infer<typeof editProductSchema>) => {
    setError("");

    const totalImagesCount = existingImages.length + imageFiles.length;

    if (totalImagesCount > 5) {
      setError("You can only upload up to 5 images");
      return;
    }

    const fd = new FormData();

    fd.append("productId", product.id);
    fd.append("name", data.name);
    fd.append("sku", data.sku);
    fd.append("brandId", data.brandId);
    fd.append("categoryId", data.categoryId);
    fd.append("gender", data.gender);
    fd.append("dressStyle", data.dressStyle);
    fd.append("description", content);

    fd.append("variants", JSON.stringify(data.variants));

    imageFiles.forEach((file, idx) => {
      fd.append("images", file);
      fd.append(
        `isMain-new-${idx}`,
        imagePreviews[idx]?.isMain ? "true" : "false"
      );
    });

    existingImages.forEach((img, idx) => {
      fd.append(`existingImageId-${idx}`, img.publicId);
      fd.append(`isMain-existing-${idx}`, img.isMain ? "true" : "false");
    });

    imagesToDelete.forEach((id, i) => {
      fd.append(`toDeleteImageId-${i}`, id);
    });

    startTransition(() => {
      editProduct(fd).then((data) => {
        if (data?.error) setError(data.error);
        else toast.success(data.success);
        router.push("/products");
      });
    });
  };

  return (
    <Card className="w-full max-w-6xl py-10 px-5 h-fit">
      <CardHeader>
        <CardTitle className="text-center uppercase font-bold text-lg">
          Edit product info
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-4 gap-5"
          >
            <FormInput
              id="name"
              name="name"
              label="Product name"
              placeholder="For example: Skinny fit jeans"
              disabled={isPending}
              required
              className="col-span-3"
            />
            <FormInput
              id="sku"
              name="sku"
              label="Sku code"
              placeholder="For example: 1001"
              disabled={isPending}
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
              disabled={isPending}
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
              disabled={isPending}
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
              disabled={isPending}
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
              disabled={isPending}
            />

            <div className="col-span-4 space-y-2">
              <Label>Existing Images</Label>
              <RadioGroup
                value={mainImagePublicId}
                onValueChange={(value) => {
                  setMainImagePublicId(value);
                  setMainExistingImage(value);
                }}
                className="flex flex-wrap gap-4"
              >
                {existingImages.map((img) => (
                  <div
                    key={img.publicId}
                    className={cn(
                      "rounded-md overflow-hidden relative group bg-card-foreground/5",
                      img.isMain && "border-2 border-input"
                    )}
                  >
                    <Image
                      width={200}
                      height={200}
                      src={img.url ?? "/placeholder.jpg"}
                      sizes="100vw"
                      alt={`existing-${img.url}`}
                      className="object-contain object-center aspect-square"
                    />
                    <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-white/80 p-1 rounded">
                      <RadioGroupItem value={img.publicId} />
                      <span className="ml-1 text-sm">Main</span>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete"
                      aria-label="Delete image"
                      onClick={() => removeExistingImage(img.publicId)}
                    >
                      <X />
                    </Button>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="col-span-4 grid grid-cols-2 gap-5 mb-15">
              <div className="space-y-2">
                <Label>Images (max 5)</Label>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={isPending}
                  onChange={onFileChange}
                />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {imagePreviews.map((img, idx) => (
                    <div key={idx} className="relative border p-2">
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
                          onChange={() => setMainNewImage(idx)}
                        />
                        <span className="ml-2">Main</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Product description</Label>
                <ReactQuill
                  id="description"
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
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    variantsFieldArray.append({
                      colorId: colors[0]?.id ?? "",
                      sizeId: sizes[0]?.id ?? "",
                      quantity: 0,
                      price: 0,
                      discount: 0,
                      discountedPrice: 0,
                    })
                  }
                  disabled={isPending}
                  className="cursor-pointer"
                  title="Add variant"
                  aria-label="Add new product variant"
                >
                  <Plus />
                </Button>
              </div>
              <div className="space-y-4">
                {variantsFieldArray.fields.map((variant, index) => (
                  <div
                    key={variant.id ?? index}
                    className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center border p-3 rounded"
                  >
                    <FormSelect
                      name={`variants.${index}.colorId`}
                      label="Color"
                      options={colors.map((color) => ({
                        value: color.id,
                        label: color.name,
                      }))}
                      disabled={isPending}
                    />

                    <FormSelect
                      name={`variants.${index}.sizeId`}
                      label="Size"
                      options={sizes.map((size) => ({
                        value: size.id,
                        label: size.name,
                      }))}
                      disabled={isPending}
                    />

                    <FormInput
                      id={`variants.${index}.quantity`}
                      name={`variants.${index}.quantity`}
                      label="Quantity"
                      type="number"
                      disabled={isPending}
                      className="min-w-[80px]"
                    />

                    <FormInput
                      id={`variants.${index}.price`}
                      name={`variants.${index}.price`}
                      label="Price"
                      type="number"
                      disabled={isPending}
                      className="min-w-[100px]"
                    />

                    <FormInput
                      id={`variants.${index}.discount`}
                      name={`variants.${index}.discount`}
                      label="Discount (%)"
                      type="number"
                      disabled={isPending}
                      className="min-w-[100px]"
                    />

                    <FormInput
                      id={`variants.${index}.discountedPrice`}
                      name={`variants.${index}.discountedPrice`}
                      label="Discounted Price"
                      type="number"
                      disabled
                      className="min-w-[120px]"
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={isPending}
                      onClick={() => setVariantToRemoveIndex(index)}
                      title="Delete variant"
                      aria-label="Delete product variant"
                      className="cursor-pointer"
                    >
                      <Minus />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div role="alert" aria-live="polite" aria-atomic="true">
                <FormError message={error} />
              </div>
            )}

            <div className="col-span-4 flex justify-center items-center gap-10 mt-15">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-50 cursor-pointer"
                disabled={isPending}
                aria-label="Скасувати"
                onClick={() => router.back()}
              >
                Скасувати
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                size="lg"
                className="w-50 cursor-pointer"
                aria-label="Оновити продукт"
              >
                {isPending ? "Оновлення..." : "Оновити"}
              </Button>
            </div>
          </form>
        </FormProvider>
        <ConfirmDeleteDialog
          isOpen={variantToRemoveIndex !== null}
          onOpenChange={() => setVariantToRemoveIndex(null)}
          title="Confirm variant deletion"
          description="Are you sure you want to remove this variant?"
          confirmText="Remove"
          cancelText="Cancel"
          onConfirm={() => {
            if (variantToRemoveIndex !== null) {
              variantsFieldArray.remove(variantToRemoveIndex);
              setVariantToRemoveIndex(null);
            }
          }}
        />
      </CardContent>
    </Card>
  );
};

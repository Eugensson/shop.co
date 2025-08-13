"use client";

import * as React from "react";
import { useFormContext, Path, FieldValues } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";

import { cn } from "@/lib/utils";

interface FormInputProps<TFormValues extends FieldValues> {
  id: string;
  name: Path<TFormValues>;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  textarea?: boolean;
  notification?: string;
  customRender?: (field: {
    id: string;
    disabled?: boolean;
    placeholder?: string;
  }) => React.ReactNode;
  className?: string;
}

export function FormInput<TFormValues extends FieldValues>({
  id,
  name,
  label,
  required,
  placeholder,
  disabled,
  type = "text",
  textarea,
  notification,
  customRender,
  className,
}: FormInputProps<TFormValues>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<TFormValues>();

  const error = errors[name]?.message;
  const errorMessage = typeof error === "string" ? error : undefined;

  const registerOptions = {
    required: required ? `${label ?? name} обов'язкове поле` : undefined,
    ...(type === "number" ? { valueAsNumber: true } : {}),
  };

  return (
    <FormItem className={cn("flex flex-col gap-2 w-full", className)}>
      {label && (
        <Label htmlFor={id}>
          {label}
          {notification && (
            <span className="text-muted-foreground"> {notification}</span>
          )}
        </Label>
      )}
      <FormControl>
        {customRender ? (
          customRender({ id, disabled, placeholder })
        ) : textarea ? (
          <Textarea
            id={id}
            {...register(name, registerOptions)}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className="resize-none min-h-[7.5rem] xl:min-h-60"
            aria-invalid={errorMessage ? "true" : "false"}
          />
        ) : (
          <Input
            id={id}
            type={type}
            {...register(name, registerOptions)}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            required={required}
            step={type === "number" ? "any" : undefined}
            aria-invalid={errorMessage ? "true" : "false"}
          />
        )}
      </FormControl>
      <FormMessage>{errorMessage}</FormMessage>
    </FormItem>
  );
}

"use client";

import * as React from "react";
import { useFormContext, Controller, FieldValues, Path } from "react-hook-form";

import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
}

export function FormSelect<TFormValues extends FieldValues>({
  name,
  label,
  options,
  placeholder = "Select an option",
  required,
  disabled,
  id,
}: FormSelectProps<TFormValues>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFormValues>();

  const fieldError = errors[name];
  const errorMessage = fieldError ? String(fieldError.message) : undefined;

  return (
    <FormItem>
      <FormLabel htmlFor={id ?? String(name)}>{label}</FormLabel>
      <FormControl>
        <Controller
          control={control}
          name={name}
          rules={{
            required: required ? `${label} is required` : undefined,
          }}
          render={({ field }) => (
            <Select
              disabled={disabled}
              value={field.value != null ? String(field.value) : ""}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id={id ?? String(name)}
                className="w-full"
                aria-invalid={!!errorMessage}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt, index) => (
                  <SelectItem key={`${opt.value}-${index}`} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormControl>
      <FormMessage>{errorMessage}</FormMessage>
    </FormItem>
  );
}

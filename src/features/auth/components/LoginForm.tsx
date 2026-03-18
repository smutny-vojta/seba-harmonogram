"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Field as FieldUI,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/shared/components/ui/field";
import { loginAction } from "../actions";
import { CZECH_PHONE_REGEX_WITH_PREFIX, PASSWORD_REGEX } from "../consts";

export default function LoginForm({ phoneNumber }: { phoneNumber?: string }) {
  const [showPassword, setShowPassword] = useState(false);

  const { Field, handleSubmit, state } = useForm({
    defaultValues: {
      phoneNumber: phoneNumber ?? "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const result = await loginAction(value);
      if (result?.serverError) {
        toast.error(result.serverError);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="w-full max-w-sm"
    >
      <FieldSet>
        <FieldLegend>Přihlášení instruktora</FieldLegend>

        {/* Telefonní číslo */}
        <Field
          name="phoneNumber"
          validators={{
            onChange: ({ value }: { value: string }) =>
              !CZECH_PHONE_REGEX_WITH_PREFIX.test(value)
                ? 'Formát: "+420123456789"'
                : undefined,
          }}
        >
          {(field) => (
            <FieldUI className="gap-1">
              <FieldLabel htmlFor={field.name}>
                Telefonní číslo<span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="tel"
                inputMode="tel"
                placeholder="+420123456789"
                required
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                disabled={state.isSubmitting}
                aria-invalid={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-xs">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
            </FieldUI>
          )}
        </Field>

        {/* Heslo */}
        <Field
          name="password"
          validators={{
            onChange: ({ value }: { value: string }) =>
              !PASSWORD_REGEX.test(value)
                ? "Heslo musí mít 8+ znaků, 1 velké písmeno a 1 číslo"
                : undefined,
          }}
        >
          {(field) => (
            <FieldUI className="gap-1">
              <FieldLabel htmlFor={field.name}>
                Heslo<span className="text-destructive">*</span>
              </FieldLabel>
              <div className="relative">
                <Input
                  id={field.name}
                  name={field.name}
                  type={showPassword ? "text" : "password"}
                  placeholder="Heslo"
                  required
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  disabled={state.isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-0 right-0"
                  disabled={state.isSubmitting}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </FieldUI>
          )}
        </Field>

        <Button type="submit" disabled={state.isSubmitting}>
          {state.isSubmitting ? "Přihlašuji..." : "Přihlásit se"}
        </Button>
      </FieldSet>
    </form>
  );
}

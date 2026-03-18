"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useState } from "react";
import { Check, Eye, EyeOff, X } from "lucide-react";

import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Field as FieldUI,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/shared/components/ui/field";
import { setPasswordAction } from "../actions";
import { PASSWORD_REGEX } from "../consts";

interface CreatePasswordFormProps {
  phoneNumber: string;
  setPhase: (phase: "login") => void;
}

const PASSWORD_RULES = [
  { label: "Minimálně 8 znaků", regex: /.{8,}/ },
  { label: "Alespoň 1 velké písmeno", regex: /[A-Z]/ },
  { label: "Alespoň 1 číslo", regex: /[0-9]/ },
];

export default function CreatePasswordForm({
  phoneNumber,
  setPhase,
}: CreatePasswordFormProps) {
  const [showPasswords, setShowPasswords] = useState(false);

  const { Field, handleSubmit, state } = useForm({
    defaultValues: { password: "", confirmPassword: "" },
    onSubmit: async ({ value }) => {
      const result = await setPasswordAction({ ...value, phoneNumber });
      if (result?.serverError) {
        toast.error(result.serverError);
        return;
      }
      if (result?.data?.success) {
        setPhase("login");
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
        <FieldLegend>Vytvoření hesla</FieldLegend>

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
                Zadej heslo<span className="text-destructive">*</span>
              </FieldLabel>
              <div className="relative">
                <Input
                  id={field.name}
                  name={field.name}
                  type={showPasswords ? "text" : "password"}
                  placeholder="Heslo"
                  required
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  disabled={state.isSubmitting}
                  aria-invalid={
                    field.state.meta.isTouched &&
                    !PASSWORD_REGEX.test(field.state.value)
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute top-0 right-0"
                  disabled={state.isSubmitting}
                >
                  {showPasswords ? <EyeOff /> : <Eye />}
                </Button>
              </div>
              {/* Pravidla hesla */}
              <ul className="mt-1 space-y-1 text-xs">
                {PASSWORD_RULES.map((rule) => {
                  const ok = rule.regex.test(field.state.value);
                  return (
                    <li
                      key={rule.label}
                      className={`flex items-center gap-1.5 pl-1 ${ok ? "text-green-600" : "text-muted-foreground"}`}
                    >
                      <span>{ok ? <Check size={12} /> : <X size={12} />}</span>
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            </FieldUI>
          )}
        </Field>

        {/* Potvrzení hesla */}
        <Field
          name="confirmPassword"
          validators={{
            onChangeListenTo: ["password"],
            onChange: ({
              value,
              fieldApi,
            }: {
              value: string;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              fieldApi: any;
            }) => {
              const password = fieldApi.getFieldValue("password");
              return value !== password ? "Hesla se neshodují" : undefined;
            },
          }}
        >
          {(field) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            const isMatch =
              field.state.meta.isTouched &&
              field.state.value.length > 0 &&
              !hasError;

            return (
              <FieldUI className="gap-1">
                <FieldLabel
                  htmlFor={field.name}
                  className={
                    hasError
                      ? "text-destructive"
                      : isMatch
                        ? "text-green-600"
                        : ""
                  }
                >
                  Zadej heslo znovu
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type={showPasswords ? "text" : "password"}
                  placeholder="Heslo znovu"
                  required
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  disabled={state.isSubmitting}
                  aria-invalid={hasError}
                  className={
                    hasError
                      ? "text-destructive"
                      : isMatch
                        ? "border-green-600 bg-green-600/10"
                        : ""
                  }
                />
                <FieldError>
                  {hasError && (
                    <p className="text-destructive text-xs">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </FieldError>
              </FieldUI>
            );
          }}
        </Field>

        <Button type="submit" disabled={state.isSubmitting}>
          {state.isSubmitting ? "Ukládám..." : "Vytvořit heslo"}
        </Button>
      </FieldSet>
    </form>
  );
}

"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Field as FieldUI,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/shared/components/ui/field";
import { verifyOtpAction } from "../actions";
import { OTP_REGEX } from "../consts";

interface VerifyOTPFormProps {
  phoneNumber: string;
  setPhase: (phase: "create-password") => void;
}

export default function VerifyOTPForm({
  phoneNumber,
  setPhase,
}: VerifyOTPFormProps) {
  const { Field, handleSubmit, state } = useForm({
    defaultValues: { otp: "" },
    onSubmit: async ({ value }) => {
      const result = await verifyOtpAction({ otp: value.otp, phoneNumber });
      if (result?.serverError) {
        toast.error(result.serverError);
        return;
      }
      if (result?.data?.success) {
        setPhase("create-password");
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
        <FieldLegend>Ověření telefonního čísla</FieldLegend>

        <Field
          name="otp"
          validators={{
            onChange: ({ value }: { value: string }) =>
              !OTP_REGEX.test(value)
                ? 'Kód musí mít 6 číslic (např. "123456")'
                : undefined,
          }}
        >
          {(field) => (
            <FieldUI className="gap-1">
              <FieldLabel htmlFor={field.name}>
                Zadej ověřovací kód
                <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="text"
                inputMode="numeric"
                placeholder="123456"
                required
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                disabled={state.isSubmitting}
                aria-invalid={field.state.meta.errors.length > 0}
              />
              <FieldDescription className="text-xs">
                {field.state.meta.errors.length > 0 ? (
                  <span className="text-destructive">
                    {String(field.state.meta.errors[0])}
                  </span>
                ) : (
                  <span>Kód ti přišel v SMS na číslo {phoneNumber}.</span>
                )}
              </FieldDescription>
            </FieldUI>
          )}
        </Field>

        <Button type="submit" disabled={state.isSubmitting}>
          {state.isSubmitting ? "Ověřuji..." : "Ověřit"}
        </Button>
      </FieldSet>
    </form>
  );
}

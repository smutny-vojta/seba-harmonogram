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
import { redirectUserOrSendOtpAction } from "../actions";
import { CZECH_PHONE_REGEX } from "../consts";

interface GetPhoneFormProps {
  setPhoneNumber: (phoneNumber: string) => void;
  setPhase: (phase: "verify-otp" | "login") => void;
}

export default function GetPhoneForm({
  setPhoneNumber,
  setPhase,
}: GetPhoneFormProps) {
  const { Field, handleSubmit, state } = useForm({
    defaultValues: { phone: "" },
    onSubmit: async ({ value }) => {
      const result = await redirectUserOrSendOtpAction(value);
      if (result?.serverError) {
        toast.error(result.serverError);
        return;
      }
      const data = result?.data;
      if (data) {
        setPhoneNumber(data.phoneNumber);
        setPhase(data.verified ? "login" : "verify-otp");
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

        <Field
          name="phone"
          validators={{
            onChange: ({ value }: { value: string }) =>
              !CZECH_PHONE_REGEX.test(value)
                ? 'Telefonní číslo musí mít 9 číslic (např. "123456789")'
                : undefined,
          }}
        >
          {(field) => (
            <FieldUI className="gap-1">
              <FieldLabel htmlFor={field.name}>
                Zadej telefonní číslo
                <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="tel"
                inputMode="tel"
                placeholder="123456789"
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
                  <span>Na toto číslo ti přijde 6místný ověřovací kód.</span>
                )}
              </FieldDescription>
            </FieldUI>
          )}
        </Field>

        <Button type="submit" disabled={state.isSubmitting}>
          {state.isSubmitting ? "Odesílám..." : "Odeslat"}
        </Button>
      </FieldSet>
    </form>
  );
}

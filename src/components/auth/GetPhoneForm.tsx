import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { redirectUserOrSendOtpAction } from "@/actions/auth";
import { CZECH_PHONE_REGEX } from "@/lib/consts";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

interface GetPhoneFormProps {
  setPhoneNumber: (phoneNumber: string) => void;
  setPhase: (phase: "verify-otp" | "login") => void;
}

export default function GetPhoneForm({
  setPhoneNumber,
  setPhase,
}: GetPhoneFormProps) {
  const [formPhone, setFormPhone] = useState<string>("");

  const { execute, isExecuting } = useAction(redirectUserOrSendOtpAction, {
    onSuccess: ({ data }) => {
      if (data) {
        setPhoneNumber(data.phoneNumber);
        if (data.verified) {
          setPhase("login");
        } else {
          setPhase("verify-otp");
        }
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || error.validationErrors?._errors?.[0] || "Něco se nepovedlo");
    },
  });

  return (
    <form 
      action={(formData) => execute(Object.fromEntries(formData) as any)} 
      className="w-full max-w-sm"
    >
      <FieldSet>
        <FieldLegend>Přihlášení instruktora</FieldLegend>
        <Field className="gap-1">
          <FieldLabel htmlFor="phone">
            Zadej telefonní číslo<span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            placeholder="123456789"
            required
            value={formPhone}
            onChange={(e) => setFormPhone(e.target.value)}
            disabled={isExecuting}
            aria-invalid={
              formPhone.length > 0 && !CZECH_PHONE_REGEX.test(formPhone)
            }
          />
          <FieldDescription className="text-xs">
            {formPhone.length > 0 && !CZECH_PHONE_REGEX.test(formPhone) ? (
              <span className="text-destructive">
                Telefonní číslo musí být ve formátu "123456789".
              </span>
            ) : (
              <span>
                Na toto telefonní číslo ti skrz WhatsApp přijde 6 místný kód.
              </span>
            )}
          </FieldDescription>
        </Field>
        <Button type="submit" disabled={isExecuting}>
          {isExecuting ? "Odesílám..." : "Odeslat"}
        </Button>
      </FieldSet>
    </form>
  );
}

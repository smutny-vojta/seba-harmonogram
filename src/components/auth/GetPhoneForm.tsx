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
import { useActionState, useEffect, useState } from "react";
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

  const handleSubmit = async (previousState: unknown, formData: FormData) => {
    if (!CZECH_PHONE_REGEX.test(formPhone)) {
      return null;
    }

    return redirectUserOrSendOtpAction(previousState, formData);
  };

  const [state, formAction] = useActionState(handleSubmit, null);

  useEffect(() => {
    if (!state) {
      return;
    }

    if (!state.success) {
      toast.error(state.error);
    } else {
      setPhoneNumber(state.phoneNumber);
      if (state.verified) {
        setPhase("login");
      } else {
        setPhase("verify-otp");
      }
    }
  }, [state]);

  return (
    <form action={formAction} className="w-full max-w-sm">
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
        <Button type="submit">Odeslat</Button>
      </FieldSet>
    </form>
  );
}

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { sendOtpCode } from "@/app/login/actions";
import { useActionState, useEffect, useState } from "react";

interface LoginPhase1Props {
  setPhoneNumber: (phoneNumber: string) => void;
  setPhase: (phase: "verify-otp") => void;
}

export default function LoginPhase1({
  setPhoneNumber,
  setPhase,
}: LoginPhase1Props) {
  const [formPhone, setFormPhone] = useState<string>("");

  // phone regex 777666555
  const phoneRegex = /^\d{9}$/;

  const handleSubmit = async (previousState: unknown, formData: FormData) => {
    if (!phoneRegex.test(formPhone)) {
      return null;
    }

    return sendOtpCode(previousState, formData);
  };

  const [state, formAction] = useActionState(handleSubmit, null);

  useEffect(() => {
    if (state) {
      setPhoneNumber(state.phoneNumber!);
      setPhase("verify-otp");
    }
  }, [state]);

  return (
    <form action={formAction} className="w-full max-w-sm">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Přihlášení instruktora</FieldLegend>
          <Field>
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
              aria-invalid={formPhone.length > 0 && !phoneRegex.test(formPhone)}
            />
            <FieldDescription className="text-xs">
              {formPhone.length > 0 && !phoneRegex.test(formPhone) ? (
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
          <Field>
            <Button type="submit">Odeslat</Button>
          </Field>
        </FieldSet>
      </FieldGroup>
    </form>
  );
}

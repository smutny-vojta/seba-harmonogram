import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { OTP_REGEX } from "@/lib/consts";
import { useActionState, useEffect, useState } from "react";
import { verifyOtpAction } from "../actions";
import { toast } from "sonner";

interface Phase1VerifyOTPProps {
  phoneNumber: string;
  setPhase: (phase: "create-password") => void;
}

const markInvalid = (formOtp: string) => {
  return formOtp.length > 0 && !OTP_REGEX.test(formOtp);
};

export default function Phase1VerifyOTP({
  phoneNumber,
  setPhase,
}: Phase1VerifyOTPProps) {
  const [formOtp, setFormOtp] = useState<string>("");

  const handleSubmit = async (previousState: unknown, formData: FormData) => {
    if (!OTP_REGEX.test(formOtp)) {
      return null;
    }

    return verifyOtpAction(previousState, formData);
  };

  const [state, formAction] = useActionState(handleSubmit, null);

  useEffect(() => {
    if (!state) {
      return;
    }

    if (!state.success) {
      toast.error(state.error);
    } else {
      setPhase("create-password");
    }
  }, [state]);

  return (
    <form action={formAction} className="w-full max-w-sm">
      <FieldSet>
        <FieldLegend>Ověření telefonního čísla</FieldLegend>
        <Field className="gap-1">
          <FieldLabel htmlFor="otp">
            Zadej ověřovací kód
            <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            placeholder="123456"
            required
            value={formOtp}
            onChange={(e) => setFormOtp(e.target.value)}
            aria-invalid={markInvalid(formOtp)}
          />

          <FieldDescription className="text-xs">
            {markInvalid(formOtp) ? (
              <span className="text-destructive">
                Kód musí být ve formátu "123456".
              </span>
            ) : (
              <span>
                Kód ti přišel v SMS zprávě na telefonní číslo {phoneNumber}.
              </span>
            )}
          </FieldDescription>
        </Field>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="hidden"
          value={phoneNumber}
        />
        <Button type="submit">Ověřit</Button>
      </FieldSet>
    </form>
  );
}

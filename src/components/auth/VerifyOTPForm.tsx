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
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { verifyOtpAction } from "../../actions/auth";
import { toast } from "sonner";

interface VerifyOTPFormProps {
  phoneNumber: string;
  setPhase: (phase: "create-password") => void;
}

const markInvalid = (formOtp: string) => {
  return formOtp.length > 0 && !OTP_REGEX.test(formOtp);
};

export default function VerifyOTPForm({
  phoneNumber,
  setPhase,
}: VerifyOTPFormProps) {
  const [formOtp, setFormOtp] = useState<string>("");

  const { execute, isExecuting } = useAction(verifyOtpAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        setPhase("create-password");
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || error.validationErrors?._errors?.[0] || "Ověření se nepovedlo");
    },
  });

  return (
    <form 
      action={(formData) => execute(Object.fromEntries(formData) as any)} 
      className="w-full max-w-sm"
    >
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
            disabled={isExecuting}
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
        <Button type="submit" disabled={isExecuting}>
          {isExecuting ? "Ověřuji..." : "Ověřit"}
        </Button>
      </FieldSet>
    </form>
  );
}

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useActionState, useEffect, useState } from "react";
import { loginAction } from "../../actions/auth";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { CZECH_PHONE_REGEX_WITH_PREFIX } from "@/lib/consts";

export default function LoginForm({ phoneNumber }: { phoneNumber?: string }) {
  const [formPhoneNumber, setFormPhoneNumber] = useState<string>(
    phoneNumber ?? "",
  );
  const [password, setPassword] = useState<string>("");
  const [showPasswords, setShowPasswords] = useState<boolean>(false);

  const handleSubmit = async (previousState: unknown, formData: FormData) => {
    return loginAction(previousState, formData);
  };

  const [state, formAction] = useActionState(handleSubmit, null);

  useEffect(() => {
    if (!state) {
      return;
    }

    if (!state.success) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="w-full max-w-sm">
      <FieldSet>
        <FieldLegend>Přihlášení instruktora</FieldLegend>
        <Field className="gap-1">
          <FieldLabel htmlFor="phoneNumber">
            Telefonní číslo
            <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            inputMode="tel"
            placeholder="123456789"
            required
            value={formPhoneNumber}
            onChange={(e) => setFormPhoneNumber(e.target.value)}
            aria-invalid={
              formPhoneNumber.length > 0 &&
              !CZECH_PHONE_REGEX_WITH_PREFIX.test(formPhoneNumber)
            }
          />
        </Field>
        <Field className="gap-1">
          <FieldLabel htmlFor="password">
            Heslo
            <span className="text-destructive">*</span>
          </FieldLabel>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPasswords ? "text" : "password"}
              placeholder="Heslo"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPasswords(!showPasswords)}
              className="absolute top-0 right-0"
            >
              {showPasswords ? <EyeOff /> : <Eye />}
            </Button>
          </div>
        </Field>
        <Button type="submit">Přihlásit se</Button>
      </FieldSet>
    </form>
  );
}

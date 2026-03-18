import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { setPasswordAction } from "../../actions/auth";
import { toast } from "sonner";
import { Check, Eye, EyeOff, X } from "lucide-react";

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
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPasswords, setShowPasswords] = useState<boolean>(false);

  const passwordValid = PASSWORD_RULES.every((r) => r.regex.test(password));
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const { execute, isExecuting } = useAction(setPasswordAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        setPhase("login");
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || error.validationErrors?._errors?.[0] || "Uložení hesla se nepovedlo");
    },
  });

  return (
    <form 
      action={(formData) => {
        if (!passwordValid) {
          toast.error("Heslo nesplňuje požadavky.");
          return;
        }
        execute(Object.fromEntries(formData) as any);
      }} 
      className="w-full max-w-sm"
    >
      <FieldSet>
        <FieldLegend>Vytvoření hesla</FieldLegend>
        <Field className="gap-1">
          <FieldLabel htmlFor="password">
            Zadej heslo
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
              disabled={isExecuting}
              aria-invalid={password.length > 0 && !passwordValid}
              className={`${
                confirmPassword.length === 0
                  ? ""
                  : !passwordsMatch
                    ? "text-destructive"
                    : "border-green-600 bg-green-600/10"
              }`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPasswords(!showPasswords)}
              className="absolute top-0 right-0"
              disabled={isExecuting}
            >
              {showPasswords ? <EyeOff /> : <Eye />}
            </Button>
          </div>
          <ul className="mt-1 space-y-1 text-xs">
            {PASSWORD_RULES.map((rule) => {
              const ok = rule.regex.test(password);
              return (
                <li
                  key={rule.label}
                  className={`flex items-center gap-1.5 pl-1 ${
                    ok ? "text-green-600" : "text-destructive"
                  }`}
                >
                  <span>{ok ? <Check size={12} /> : <X size={12} />}</span>
                  {rule.label}
                </li>
              );
            })}
          </ul>
        </Field>
        <Field className="gap-1">
          <FieldLabel
            htmlFor="confirmPassword"
            aria-invalid={confirmPassword.length > 0 && !passwordsMatch}
            className={`${
              confirmPassword.length === 0
                ? ""
                : !passwordsMatch
                  ? "text-destructive"
                  : "text-green-600"
            }`}
          >
            Zadej heslo znovu
            <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showPasswords ? "text" : "password"}
            placeholder="Heslo znovu"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isExecuting}
            aria-invalid={confirmPassword.length > 0 && !passwordsMatch}
            className={`${
              confirmPassword.length === 0
                ? ""
                : !passwordsMatch
                  ? "text-destructive"
                  : "border-green-600 bg-green-600/10"
            }`}
          />
          <FieldError>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-destructive text-xs">Hesla se neshodují.</p>
            )}
          </FieldError>
        </Field>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="hidden"
          value={phoneNumber}
        />
        <Button type="submit" disabled={isExecuting}>
          {isExecuting ? "Ukládám..." : "Vytvořit heslo"}
        </Button>
      </FieldSet>
    </form>
  );
}

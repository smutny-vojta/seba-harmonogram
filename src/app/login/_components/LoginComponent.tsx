"use client";

import GetPhoneForm from "./GetPhoneNumber";
import { Card, CardContent } from "@/components/ui/card";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useState } from "react";
import VerifyOTPForm from "./VerifyOTPForm";
import CreatePasswordForm from "./CreatePassword";
import LoginForm from "./LoginForm";

export default function LoginComponent() {
  type Phase = "send-otp" | "verify-otp" | "create-password" | "login";

  const [phase, setPhase] = useState<Phase>("send-otp");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  return (
    <ErrorBoundary>
      <Card className="w-full max-w-sm">
        <CardContent>
          {phase === "send-otp" && (
            <GetPhoneForm setPhoneNumber={setPhoneNumber} setPhase={setPhase} />
          )}
          {phase === "verify-otp" && (
            <VerifyOTPForm phoneNumber={phoneNumber} setPhase={setPhase} />
          )}
          {phase === "create-password" && (
            <CreatePasswordForm phoneNumber={phoneNumber} setPhase={setPhase} />
          )}
          {phase === "login" && <LoginForm phoneNumber={phoneNumber} />}
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
}

"use client";

import LoginPhase1 from "./LoginPhaseSendOTP";
import { Card, CardContent } from "@/components/ui/card";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useState } from "react";
import LoginPhase2 from "./LoginPhaseVerifyOTP";

export default function LoginComponent() {
  type Phase = "send-otp" | "verify-otp" | "create-password" | "login";

  const [phase, setPhase] = useState<Phase>("send-otp");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  return (
    <ErrorBoundary>
      <Card className="w-full max-w-sm">
        <CardContent>
          {phase === "send-otp" && (
            <LoginPhase1 setPhoneNumber={setPhoneNumber} setPhase={setPhase} />
          )}
          {phase === "verify-otp" && <LoginPhase2 phoneNumber={phoneNumber} />}
          {phase === "login" && <div>Login</div>}
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
}

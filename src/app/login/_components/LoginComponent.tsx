"use client";

import Phase0GetPhoneNumber from "./Phase0GetPhoneNumber";
import { Card, CardContent } from "@/components/ui/card";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useState } from "react";
import Phase1VerifyOTP from "./Phase1VerifyOTP";
import Phase2CreatePassword from "./Phase2CreatePassword";
import Phase3Login from "./Phase3Login";

export default function LoginComponent() {
  type Phase = "send-otp" | "verify-otp" | "create-password" | "login";

  const [phase, setPhase] = useState<Phase>("send-otp");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  return (
    <ErrorBoundary>
      <Card className="w-full max-w-sm">
        <CardContent>
          {phase === "send-otp" && (
            <Phase0GetPhoneNumber
              setPhoneNumber={setPhoneNumber}
              setPhase={setPhase}
            />
          )}
          {phase === "verify-otp" && (
            <Phase1VerifyOTP phoneNumber={phoneNumber} setPhase={setPhase} />
          )}
          {phase === "create-password" && (
            <Phase2CreatePassword
              phoneNumber={phoneNumber}
              setPhase={setPhase}
            />
          )}
          {phase === "login" && <Phase3Login phoneNumber={phoneNumber} />}
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
}

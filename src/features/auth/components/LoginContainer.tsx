"use client";

import GetPhoneForm from "./GetPhoneForm";
import { Card, CardContent } from "@/shared/components/ui/card";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import { useState } from "react";
import VerifyOTPForm from "./VerifyOTPForm";
import CreatePasswordForm from "./CreatePasswordForm";
import LoginForm from "./LoginForm";
import { Toaster } from "@/shared/components/ui/sonner";

export default function LoginComponent() {
  type Phase = "send-otp" | "verify-otp" | "create-password" | "login";

  const [phase, setPhase] = useState<Phase>("send-otp");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  return (
    <div className="flex h-screen items-center justify-center">
      <Toaster
        expand
        richColors
        position="top-center"
        duration={4000}
        className="z-99"
      />
      <ErrorBoundary>
        <Card className="w-full max-w-sm">
          <CardContent>
            {phase === "send-otp" && (
              <GetPhoneForm
                setPhoneNumber={setPhoneNumber}
                setPhase={setPhase}
              />
            )}
            {phase === "verify-otp" && (
              <VerifyOTPForm phoneNumber={phoneNumber} setPhase={setPhase} />
            )}
            {phase === "create-password" && (
              <CreatePasswordForm
                phoneNumber={phoneNumber}
                setPhase={setPhase}
              />
            )}
            {phase === "login" && <LoginForm phoneNumber={phoneNumber} />}
          </CardContent>
        </Card>
      </ErrorBoundary>
    </div>
  );
}

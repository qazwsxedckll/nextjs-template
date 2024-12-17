"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useActionState, useRef } from "react";
import { verifyPasswordResetEmailAction } from "./actions";

const initialPasswordResetEmailVerificationState = {
  message: "",
};

export function PasswordResetEmailVerificationForm({
  email,
}: {
  email: string;
}) {
  const [state, action] = useActionState(
    verifyPasswordResetEmailAction,
    initialPasswordResetEmailVerificationState
  );
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle>Verify your email address</CardTitle>
        <CardDescription>We sent an 8-digit code to {email}.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center">
        <form action={action} ref={formRef}>
          <InputOTP
            maxLength={8}
            autoFocus
            onComplete={() => formRef.current?.submit()}
            name="code"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
              <InputOTPSlot index={6} />
              <InputOTPSlot index={7} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-red-500 mt-2">{state.message}</p>
        </form>
      </CardContent>
      {/* <CardFooter>
      </CardFooter> */}
    </Card>
  );
}

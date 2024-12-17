"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  resendEmailVerificationCodeAction,
  verifyEmailAction,
} from "./actions";

const emailVerificationInitialState = {
  message: "",
};

const resendEmailInitialState = {
  message: "",
};

export function EmailVerificationForm({ email }: { email: string }) {
  const [verifyState, verifyAction] = useActionState(
    verifyEmailAction,
    emailVerificationInitialState
  );
  const [resendState, resendAction] = useActionState(
    resendEmailVerificationCodeAction,
    resendEmailInitialState
  );
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle>Verify your email address</CardTitle>
        <CardDescription>We sent an 8-digit code to {email}.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center">
        <form action={verifyAction} ref={formRef}>
          <InputOTP
            maxLength={8}
            autoFocus
            onComplete={() => formRef.current?.requestSubmit()}
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
          <p className="text-red-500 mt-2">{verifyState.message}</p>
        </form>
      </CardContent>
      <CardFooter>
        <form action={resendAction}>
          <Button>Resend code</Button>
        </form>
        <p>{resendState.message}</p>
      </CardFooter>
    </Card>
  );
}

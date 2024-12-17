"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { resetPasswordAction } from "./actions";

const initialPasswordResetState = {
  message: "",
};

export function PasswordResetForm() {
  const [state, action, isPending] = useActionState(
    resetPasswordAction,
    initialPasswordResetState
  );
  return (
    <Card className="mx-auto max-w-sm w-96">
      <CardHeader>
        <CardTitle className="text-2xl">Enter your new password</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" action={action}>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
            />
            {state.message && <p className="text-red-500">{state.message}</p>}
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            Reset password
          </Button>
          {state.message && <p className="text-red-500">{state.message}</p>}
        </form>
      </CardContent>
    </Card>
  );
}

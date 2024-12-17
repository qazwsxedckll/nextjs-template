"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { forgotPasswordAction } from "./actions";

const initialForgotPasswordState = {
  message: "",
};

export function ForgotPasswordForm() {
  const router = useRouter();
  const [state, action, isPending] = useActionState(
    forgotPasswordAction,
    initialForgotPasswordState
  );

  return (
    <Card className="mx-auto max-w-sm w-96">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot yousr password?</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" action={action}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" />
            {state.message && <p className="text-red-500">{state.message}</p>}
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            Send
          </Button>
          {state.message && <p className="text-red-500">{state.message}</p>}
        </form>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => router.push("/login")}
        >
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}

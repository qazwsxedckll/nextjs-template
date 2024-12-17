"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState, useState } from "react";
import { signupAction } from "./actions";

export function SignUpForm() {
  const [state, action, isPending] = useActionState(signupAction, undefined);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  return (
    <Card className="mx-auto max-w-sm w-96">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your details to create an account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" action={action}>
          <div className="grid grid-cols-2 gap-x-2">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                defaultValue={formData.username}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    username: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                defaultValue={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            {state?.errors?.username && (
              <p className="text-red-500">{state.errors.username}</p>
            )}
            {state?.errors?.email && (
              <p className="text-red-500">{state.errors.email}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" />
            {state?.errors?.password && (
              <div className="text-red-500">
                <p>Password must:</p>
                <ul>
                  {state.errors.password.map((error) => (
                    <li key={error}>- {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm">Repeat your password</Label>
            <Input id="confirm" name="confirm" type="password" />
            {state?.errors?.confirm && (
              <p className="text-red-500">{state.errors.confirm}</p>
            )}
          </div>
          <Button disabled={isPending} type="submit" className="w-full">
            Sign Up
          </Button>
          <p className="text-red-500">{state?.message}</p>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

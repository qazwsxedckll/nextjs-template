"use client";

import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { logoutAction } from "../_actions/logout";

export function LogoutButton() {
  const [, action, isPending] = useActionState(logoutAction, undefined);
  return (
    <form action={action}>
      <Button disabled={isPending}>Logout</Button>
    </form>
  );
}

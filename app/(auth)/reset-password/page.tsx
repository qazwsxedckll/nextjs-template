import { PasswordResetForm } from "./components";

import { validatePasswordResetSession } from "@/lib/auth/password-reset";
import { redirect } from "next/navigation";

export default async function Page() {
  const { session } = await validatePasswordResetSession();
  if (!session) {
    return redirect("/forgot-password");
  }
  if (!session.emailVerified) {
    return redirect("/reset-password/verify-email");
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <PasswordResetForm />
    </div>
  );
}

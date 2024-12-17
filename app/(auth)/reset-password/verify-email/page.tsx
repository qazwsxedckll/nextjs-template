import { validatePasswordResetSession } from "@/lib/auth/password-reset";
import { redirect } from "next/navigation";
import { PasswordResetEmailVerificationForm } from "./components";

export default async function Page() {
  const { session } = await validatePasswordResetSession();
  if (!session) {
    return redirect("/forgot-password");
  }
  if (session.emailVerified) {
    return redirect("/reset-password");
  }
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <PasswordResetEmailVerificationForm email={session.email} />
    </div>
  );
}

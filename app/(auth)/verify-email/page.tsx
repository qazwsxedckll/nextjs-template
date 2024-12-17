import { getUserEmailVerificationRequestFromRequest } from "@/lib/auth/email-verification";
import { getCurrentSessionWithoutRedirect } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { EmailVerificationForm } from "./components";

export default async function Page() {
  const { user } = await getCurrentSessionWithoutRedirect();
  if (!user) {
    return redirect("/login");
  }

  const verificationRequest =
    await getUserEmailVerificationRequestFromRequest();
  if (!verificationRequest && user.emailVerified) {
    return redirect("/");
  }
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <EmailVerificationForm email={verificationRequest?.email ?? user.email} />
    </div>
  );
}

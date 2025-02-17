import { LoginForm } from "./components";

import { getCurrentSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await getCurrentSession();
  if (user) {
    if (!user.emailVerified) {
      return redirect("/verify-email");
    }
    return redirect("/");
  }
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}

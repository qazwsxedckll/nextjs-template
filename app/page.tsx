import { getCurrentSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await getCurrentSession();
  if (!user) {
    return redirect("/login");
  }
  if (!user.emailVerified) {
    return redirect("/verify-email");
  }

  return redirect("/home");
}

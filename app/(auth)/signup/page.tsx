import { getCurrentSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { SignUpForm } from "./components";

export default async function Page() {
  const { user } = await getCurrentSession();
  if (user) {
    return redirect("/");
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <SignUpForm />;
    </div>
  );
}

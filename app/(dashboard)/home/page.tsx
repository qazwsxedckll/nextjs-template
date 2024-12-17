import { getCurrentSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { LogoutButton } from "./components";

export default async function Page() {
  const { user } = await getCurrentSession();
  if (!user) {
    return redirect("/login");
  }

  return (
    <>
      <h1>Home</h1>
      <p>Welcome back, {user.username}!</p>
      <LogoutButton />
    </>
  );
}

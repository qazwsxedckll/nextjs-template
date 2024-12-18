import { getCurrentSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await getCurrentSession();
  if (!user) {
    return redirect("/login");
  }

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome back, {user.username}!</p>
    </div>
  );
}

"use server";

import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from "@/lib/auth/session";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const { session } = await getCurrentSession();
  if (!session) {
    return redirect("/login");
  }
  await invalidateSession(session.id);
  await deleteSessionTokenCookie();
  return redirect("/login");
}

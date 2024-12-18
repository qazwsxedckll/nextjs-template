import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getCurrentSession } from "@/lib/auth/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "./_components/app-sidebar";
import { LogoutButton } from "./_components/logout-button";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  const { user } = await getCurrentSession();
  if (!user) {
    return redirect("/login");
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <div className="flex flex-col w-full">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b">
          <div className="px-3">
            <SidebarTrigger />
          </div>
          <div className="flex items-center">
            <div>
              <span>{user.username}</span>
            </div>
            <div className="px-3">
              <LogoutButton />
            </div>
          </div>
        </header>
        {children}
      </div>
    </SidebarProvider>
  );
}

import AppNav from "@/components/layout/app_nav";
import { getNavUserDisplay } from "@/lib/features/auth/utils";
import { getAdminEmail } from "@/lib/features/auth/session";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const email = await getAdminEmail();
  const user = getNavUserDisplay(email);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden md:flex-row">
      <AppNav user={user} />
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

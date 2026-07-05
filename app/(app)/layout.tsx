import AppNav from "@/components/layout/app_nav";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full overflow-hidden flex-col md:flex-row">
      <AppNav />
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

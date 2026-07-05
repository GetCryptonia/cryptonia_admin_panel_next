import AppNav from "@/components/layout/app_nav";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <AppNav />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

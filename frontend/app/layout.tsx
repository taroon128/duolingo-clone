import type { Metadata } from "next";
import "../styles/globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Duolingo Clone",
  description: "A Duolingo-style language learning app (assignment project).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        {/*
          BottomNav is "use client" (needs usePathname to highlight
          the active tab) but is rendered here in the Server Component
          layout — Next.js handles the boundary automatically when the
          child declares "use client".
          The pb-16 on the body ensures page content is never hidden
          behind the fixed bottom nav bar.
        */}
        <BottomNav />
      </body>
    </html>
  );
}

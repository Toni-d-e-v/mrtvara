import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { isAdmin } from "@/lib/auth";
import { signOut } from "@/lib/actions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mrtvara Liga",
  description: "SPID vs BELO — rezultati, golovi i statistika s Mrtvare",
};

export const viewport = {
  themeColor: "#0b0e14",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await isAdmin();

  return (
    <html
      lang="hr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
          <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl">🏟️</span>
              <span className="text-base font-extrabold tracking-tight">
                Mrtvara <span className="text-accent">Liga</span>
              </span>
            </Link>
            {admin ? (
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                >
                  Odjava
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-border px-3 py-1 text-xs text-muted"
              >
                Admin
              </Link>
            )}
          </div>
        </header>

        <main className="mx-auto w-full max-w-md flex-1 px-4 pb-24 pt-4">
          {children}
        </main>

        <BottomNav />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Oswald, Inter, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { LogOut, Shield } from "lucide-react";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import IntroSplash from "@/components/IntroSplash";
import KitChip from "@/components/KitChip";
import SoundToggle from "@/components/SoundToggle";
import { isAdmin } from "@/lib/auth";
import { signOut } from "@/lib/actions";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Mrtvara Liga",
  description: "LIQUI MOLY vs FORMULA — vječiti derbi s Mrtvare. Rezultati, golovi i statistika.",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Mrtvara" },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-icon.png",
  },
};

export const viewport = {
  themeColor: "#0a0c10",
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
      className={`${oswald.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Špica ide jednom po sesiji; odluka pada prije prvog paint-a da
            sadržaj aplikacije ne bljesne ispod nje. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(location.search.indexOf('intro')>-1||!sessionStorage.getItem('mrtvara-intro')){sessionStorage.setItem('mrtvara-intro','1');var s=document.createElement('style');s.id='intro-on';s.textContent='body .intro{display:grid}html{overflow:hidden}';document.head.appendChild(s);window.__introT0=performance.now()}}catch(e){}`,
          }}
        />
        <IntroSplash />

        <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex items-center -space-x-1">
                <KitChip team="SPID" size={20} />
                <KitChip team="BELO" size={20} />
              </span>
              <span className="display text-lg leading-none tracking-wide">
                MRTVARA <span className="text-accent">LIGA</span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <SoundToggle />
              {admin ? (
                <form action={signOut}>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground"
                  >
                    <LogOut size={13} />
                    Odjava
                  </button>
                </form>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground"
                >
                  <Shield size={13} />
                  Admin
                </Link>
              )}
            </div>
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

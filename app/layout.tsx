import type { Metadata } from "next";
import { Inter, Inter_Tight, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { LogOut, Shield } from "lucide-react";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import IntroSplash from "@/components/IntroSplash";
import KitChip from "@/components/KitChip";
import SoundToggle from "@/components/SoundToggle";
import { isAdmin } from "@/lib/auth";
import { signOut } from "@/lib/actions";

// Inter Tight za naslove i rezultate, Inter za tekst — blizu SF Pro Display/Text.
const display = Inter_Tight({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
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
      className={`${display.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Špica ide jednom po sesiji; odluka pada prije prvog paint-a da
            sadržaj aplikacije ne bljesne ispod nje. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(location.search.indexOf('intro')>-1||!sessionStorage.getItem('mrtvara-intro')){sessionStorage.setItem('mrtvara-intro','1');var s=document.createElement('style');s.id='intro-on';s.textContent='body .intro{display:grid}html{overflow:hidden}';document.head.appendChild(s)}}catch(e){}`,
          }}
        />
        <IntroSplash />

        <header className="material sticky top-0 z-40 border-b border-border">
          <div className="mx-auto flex max-w-md items-center justify-between gap-3 px-4 py-3">
            <Link href="/" className="press flex items-center gap-2.5">
              <span className="flex items-center -space-x-1">
                <KitChip team="SPID" size={20} />
                <KitChip team="BELO" size={20} />
              </span>
              <span className="display text-[17px] leading-none">
                Mrtvara <span className="text-accent">Liga</span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <SoundToggle />
              {admin ? (
                <form action={signOut}>
                  <button type="submit" className="chip press">
                    <LogOut size={13} />
                    Odjava
                  </button>
                </form>
              ) : (
                <Link href="/login" className="chip press">
                  <Shield size={13} />
                  Admin
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-md flex-1 px-4 pb-[7.5rem] pt-4">
          {children}
        </main>

        <BottomNav />
      </body>
    </html>
  );
}

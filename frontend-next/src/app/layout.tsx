import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, Compass, UserRound } from "lucide-react";
import { Providers } from "@/app/providers";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AuthActions } from "@/components/layout/auth-actions";
import { OfflineBanner } from "@/components/ui/offline-banner";
import "./globals.css";

export const metadata: Metadata = { title: "Northstar — Find work that fits", description: "Thoughtful teams, meaningful work, and your next good thing." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body><Providers><div className="app-frame"><a className="skip-link" href="#main-content">Skip to content</a><header className="topbar"><Link href="/jobs" className="brand" aria-label="Northstar home"><span className="brand-mark">n</span><span>northstar<span className="brand-period">.</span></span></Link><nav className="main-nav" aria-label="Main navigation"><Link className="nav-current" href="/jobs"><Compass size={16}/> Find a job</Link><Link href="/applications"><BriefcaseBusiness size={16}/> My applications</Link></nav><AuthActions/><MobileNav/></header><OfflineBanner/><main id="main-content">{children}</main><footer className="site-footer"><Link href="/jobs" className="brand"><span className="brand-mark">n</span><span>northstar<span className="brand-period">.</span></span></Link><span>Thoughtful work starts with people.</span><span>© 2026 Northstar</span></footer></div></Providers></body></html>;
}

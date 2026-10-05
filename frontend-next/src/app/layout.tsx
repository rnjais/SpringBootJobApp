import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, Compass, Heart, Menu, UserRound } from "lucide-react";
import { Providers } from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = { title: "Northstar — Find work that fits", description: "Thoughtful teams, meaningful work, and your next good thing." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Providers><div className="app-frame"><header className="topbar"><Link href="/jobs" className="brand" aria-label="Northstar home"><span className="brand-mark">n</span><span>northstar<span className="brand-period">.</span></span></Link><nav className="main-nav" aria-label="Main navigation"><Link className="nav-current" href="/jobs"><Compass size={16}/> Find a job</Link><Link href="/applications"><BriefcaseBusiness size={16}/> My applications</Link></nav><div className="nav-actions"><button className="icon-button saved-button" aria-label="Saved jobs"><Heart size={17}/></button><Link href="/login" className="login-link"><UserRound size={16}/> Sign in</Link><Link href="/register" className="button button-dark nav-join">Join Northstar <ArrowUpRight size={15}/></Link></div><button className="mobile-menu icon-button" aria-label="Open navigation menu"><Menu size={20}/></button></header><main id="main-content">{children}</main><footer className="site-footer"><Link href="/jobs" className="brand"><span className="brand-mark">n</span><span>northstar<span className="brand-period">.</span></span></Link><span>Thoughtful work starts with people.</span><span>© 2026 Northstar</span></footer></div></Providers></body></html>;
}

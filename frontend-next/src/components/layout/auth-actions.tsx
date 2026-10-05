"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, LogOut, UserRound } from "lucide-react";
import { useSession } from "@/features/auth/store/session";
import type { UserSession } from "@/features/auth/types";
export function AuthActions() { const user = useSession((state) => state.user); const setUser = useSession((state) => state.setUser); const clear = useSession((state) => state.clear); const router = useRouter(); useEffect(() => { const stored = localStorage.getItem("user"); if (!stored) return; try { setUser(JSON.parse(stored) as UserSession); } catch { clear(); } }, [setUser, clear]); if (!user) return <div className="nav-actions"><Link href="/login" className="login-link"><UserRound size={16}/> Sign in</Link><Link href="/register" className="button button-dark nav-join">Join Northstar <ArrowUpRight size={15}/></Link></div>; return <div className="nav-actions"><Link href="/applications" className="login-link"><UserRound size={16}/> {user.firstName}</Link><button className="logout-button" onClick={() => { clear(); router.replace("/jobs"); }}><LogOut size={14}/> Sign out</button></div>; }

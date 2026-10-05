import { Suspense } from "react";
import { AuthForm } from "@/features/auth/components/auth-form";
export default function RegisterPage() { return <Suspense fallback={<main className="page-shell"/>}><AuthForm mode="register"/></Suspense>; }

import Link from "next/link";
import { BriefcaseBusiness, Compass, Menu, UserRound } from "lucide-react";
export function MobileNav() { return <details className="mobile-menu"><summary aria-label="Open navigation menu"><Menu size={20}/></summary><nav aria-label="Mobile navigation"><Link href="/jobs"><Compass size={15}/> Find a job</Link><Link href="/applications"><BriefcaseBusiness size={15}/> My applications</Link><Link href="/login"><UserRound size={15}/> Sign in</Link></nav></details>; }

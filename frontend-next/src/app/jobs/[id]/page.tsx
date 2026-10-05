import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, Building2, CalendarDays, Check, CircleDollarSign, MapPin, ShieldCheck } from "lucide-react";
import { JobDetail } from "@/features/jobs/components/job-detail";
type Props = { params: Promise<{ id: string }> };
export default async function JobDetailsPage({ params }: Props) { const { id } = await params; return <JobDetail id={id}/>; }

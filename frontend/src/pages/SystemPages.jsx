import { Link, useRouteError } from 'react-router-dom';
import { ArrowLeft, Compass, ShieldX } from 'lucide-react';
import { Button } from '../components/ui';
export function ForbiddenPage(){return <main className="system-page"><ShieldX size={36}/><span className="eyebrow">403 · ACCESS RESTRICTED</span><h1>This space isn’t yours to enter.</h1><p>Your account doesn’t have access to this workspace.</p><Link to="/"><Button variant="secondary"><ArrowLeft size={16}/> Back to Northstar</Button></Link></main>;}
export function NotFoundPage(){return <main className="system-page"><Compass size={36}/><span className="eyebrow">404 · OFF THE MAP</span><h1>This page wandered off.</h1><p>Let’s get you back to the opportunities that matter.</p><Link to="/jobs"><Button>Explore open roles</Button></Link></main>;}
export function RouteErrorPage(){const error=useRouteError();return <main className="system-page"><h1>We couldn’t open this page.</h1><p>{error?.statusText||error?.message||'Please try again in a moment.'}</p><Link to="/"><Button variant="secondary">Return home</Button></Link></main>;}

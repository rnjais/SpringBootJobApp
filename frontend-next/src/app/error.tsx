"use client";

import { useEffect } from "react";
import { RefreshCw, TriangleAlert } from "lucide-react";
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="error-page"><span className="error-symbol"><TriangleAlert/></span><p className="eyebrow">A QUICK DETOUR</p><h1>We hit a snag.</h1><p>Something didn’t load as expected. Your progress is safe.</p><button className="button button-dark" onClick={reset}><RefreshCw size={16}/> Try again</button></main>;
}

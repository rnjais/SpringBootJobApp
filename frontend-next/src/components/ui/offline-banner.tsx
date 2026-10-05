"use client";
import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
export function OfflineBanner() { const [online, setOnline] = useState(true); useEffect(() => { const update = () => setOnline(navigator.onLine); update(); window.addEventListener("online", update); window.addEventListener("offline", update); return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); }; }, []); return online ? null : <div className="offline-banner" role="status"><WifiOff size={14}/> You’re offline. We’ll reconnect and refresh your results when you’re back.</div>; }

import Link from "next/link";
export default function NotFound() { return <main className="error-page"><p className="eyebrow">404 · PAGE NOT FOUND</p><h1>That page moved on.</h1><p>Let’s get you back to the opportunities.</p><Link className="button button-dark" href="/jobs">Browse open roles</Link></main>; }

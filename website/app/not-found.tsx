import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-[family-name:var(--font-display)] text-7xl font-bold text-[#3B5BFF]">404</p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold text-[#0F1330]">Page not found</h1>
      <p className="mt-2 text-[#4B5275]">The page you are looking for does not exist or has moved.</p>
      <Link href="/" className="mt-8 rounded-full bg-gradient-to-r from-[#3B5BFF] to-[#7C3AED] px-7 py-3 text-sm font-semibold text-white">
        Back to home
      </Link>
    </main>
  );
}

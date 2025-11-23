"use client";
import Link from "next/link";

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
    >
      <img src="/logo.svg" alt="logo" className="w-9 h-9" />
      <span className="font-bold text-lg whitespace-nowrap hidden sm:inline">
        TraceLog
      </span>
    </Link>
  );
}

export default Logo;

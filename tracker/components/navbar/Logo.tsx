"use client";
import Link from "next/link";
import { Button } from "../ui/button";

function Logo() {
  return (
    <Button size="icon" asChild variant="ghost">
      <Link href="/" className="bg-transparent">
        <img src="/logo.svg" alt="logo" className="w-9 h-9" />
      </Link>
    </Button>
  );
}
export default Logo;

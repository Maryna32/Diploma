"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, User } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { links } from "../../utlis/links";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type LinksDropdownProps = {
  user: any;
};

function LinksDropdown({ user }: LinksDropdownProps) {
  const router = useRouter();

  const logOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const visibleLinks = links.filter((link) => {
    if (link.isPublic) return true;
    return user !== null;
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex gap-2 max-w-[100px]">
          <EllipsisVertical className="w-5 h-5" />
          <User className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end" sideOffset={10}>
        {visibleLinks.map((link) => {
          return (
            <DropdownMenuItem key={link.href} asChild>
              <Link
                href={link.href}
                className="capitalize w-full cursor-pointer"
              >
                {link.label}
              </Link>
            </DropdownMenuItem>
          );
        })}

        {user && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button
                onClick={logOut}
                className="w-full text-left cursor-pointer"
              >
                Вийти
              </button>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LinksDropdown;

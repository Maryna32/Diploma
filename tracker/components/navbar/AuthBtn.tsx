"use client";

import { Button } from "../ui/button";
import { LogIn, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type AuthBtnProps = {
  title: string;
};

function AuthBtn({ title }: AuthBtnProps) {
  const router = useRouter();

  const handleAuth = async () => {
    if (title === "Вийти") {
      await supabase.auth.signOut();
      router.refresh();
    } else {
      router.push("/auth");
    }
  };

  return (
    <Button
      variant={title === "Ввійти" ? "default" : "secondary"}
      size="sm"
      onClick={handleAuth}
    >
      {title === "Ввійти" ? (
        <LogIn className="h-4 w-4" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      {title}
    </Button>
  );
}

export default AuthBtn;

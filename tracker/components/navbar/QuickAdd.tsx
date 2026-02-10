"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
function QuickAdd() {
  const router = useRouter();
  return (
    <Button
      variant="default"
      size="sm"
      className="hidden md:flex items-center gap-1"
      aria-label="Швидке додавання нового запису"
      onClick={() => router.push("/add-log")}
    >
      <Plus className="h-4 w-4" />
      Додати
    </Button>
  );
}

export default QuickAdd;

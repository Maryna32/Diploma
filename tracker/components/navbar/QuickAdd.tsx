"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";

function QuickAdd() {
  const handleQuickAdd = () => {
    console.log("Відкрити модальне вікно для додавання запису");
  };

  return (
    <Button
      variant="default"
      size="sm"
      className="hidden md:flex items-center gap-1"
      aria-label="Швидке додавання нового запису"
      onClick={handleQuickAdd}
    >
      <Plus className="h-4 w-4" />
      Додати
    </Button>
  );
}

export default QuickAdd;

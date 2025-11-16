import { Bell } from "lucide-react";
import { Button } from "../ui/button";

function BellNotification() {
  const count = 3;

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Сповіщення"
      className="relative"
    >
      <Bell className="h-5 w-5" />

      {count > 0 && (
        <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
      )}
    </Button>
  );
}

export default BellNotification;

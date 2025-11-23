import { Button } from "../ui/button";
import { LogIn, LogOut } from "lucide-react";

type TitleBtnProps = {
  title: string;
};

function AuthBtn({ title }: TitleBtnProps) {
  return (
    <Button
      className="bg-primary text-primary-foreground"
      variant={title === "Ввійти" ? "default" : "secondary"}
      size="sm"
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

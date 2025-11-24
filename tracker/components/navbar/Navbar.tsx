import { createClient } from "@/lib/supabase/server";
import Logo from "./Logo";
import LinksDropdown from "./LinksDropdown";
import BellNotification from "./BellNotification";
import NavSearch from "./NavSearch";
import QuickAdd from "./QuickAdd";
import AuthBtn from "./AuthBtn";
import DarkMode from "./DarkMode";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const authTitle = user === null ? "Ввійти" : "Вийти";

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-sm">
      <div className="flex h-16 items-center px-4 gap-3">
        <div className="shrink-0">
          <Logo />
        </div>
        <div className="flex-1 min-w-0">
          <NavSearch />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {user && <QuickAdd />}
          <AuthBtn title={authTitle} />
          <DarkMode />
          {user !== null && <BellNotification />}
          <LinksDropdown user={user} />
        </div>
      </div>
    </header>
  );
}

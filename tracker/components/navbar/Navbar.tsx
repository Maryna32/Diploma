import Logo from "./Logo";
import LinksDropdown from "./LinksDropdown";
import BellNotification from "./BellNotification";
import NavSearch from "./NavSearch";
import QuickAdd from "./QuickAdd";
import AuthBtn from "./AuthBtn";
import DarkMode from "./DarkMode";

const user = null;

export default function Navbar() {
  const authTitle = user === null ? "Ввійти" : "Вийти";
  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-sm">
      <div className="flex h-16 items-center px-4 gap-3">
        <Logo />
        <div className="flex-1">
          <NavSearch />
        </div>
        <div className="flex items-center gap-2">
          <QuickAdd />
          <AuthBtn title={authTitle} />
          <DarkMode />
          {user !== null && <BellNotification />}
          <LinksDropdown />
        </div>
      </div>
    </header>
  );
}

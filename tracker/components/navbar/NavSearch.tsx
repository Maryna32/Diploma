import { Search } from "lucide-react";
import { Input } from "../ui/input";

function NavSearch() {
  return (
    <div className="flex-1 justify-center px-4 sm:px-6 hidden md:flex">
      <div className="relative w-full max-w-lg">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          type="search"
          placeholder="Пошук користувачів або публікацій..."
          className="w-full pl-10 h-9"
        />
      </div>
    </div>
  );
}

export default NavSearch;

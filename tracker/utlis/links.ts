type NavLink = {
  href: string;
  label: string;
  isPublic: boolean;
};

export const links: NavLink[] = [
  { href: "/", label: "Головна", isPublic: true },
  { href: "/my-log", label: "Мій журнал", isPublic: false },
  { href: "/stats", label: "Статистика", isPublic: false },
  { href: "/trends", label: "Тренди", isPublic: true },
  { href: "/community", label: "Спільнота", isPublic: true },
  { href: "/profile", label: "Профіль", isPublic: false },
];

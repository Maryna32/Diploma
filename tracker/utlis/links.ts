type NavLink = {
  href: string;
  label: string;
};

export const links: NavLink[] = [
  { href: "/", label: "Головна" },
  { href: "/my-log", label: "Мій журнал" },
  { href: "/stats", label: "Статистика" },
  { href: "/trends", label: "Тренди" },
  { href: "/community", label: "Спільнота" },
  { href: "/profile", label: "Профіль" },
];

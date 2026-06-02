import { Home, FileText, Search, User } from "lucide-react";

export default function BottomNavBar() {
  const navItems = [
    {
      name: "Home",
      icon: Home,
      href: "/",
    },
    {
      name: "Resume",
      icon: FileText,
      href: "/resume",
    },
    {
      name: "Search",
      icon: Search,
      href: "/search",
    },
    {
      name: "Profile",
      icon: User,
      href: "/profile",
    },
  ];

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%]">
      
      <div
        className="
          flex items-center justify-around
          rounded-2xl
          border border-cyan-500/20
          bg-black/80
          backdrop-blur-xl
          shadow-[0_0_30px_rgba(0,255,255,0.08)]
          px-2 py-3
        "
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.name}
              href={item.href}
              className="
                flex flex-col items-center justify-center
                text-gray-400
                transition-all duration-300
                hover:text-cyan-400
                active:scale-95
              "
            >
              <Icon size={22} />

              <span className="text-[11px] mt-1 font-medium">
                {item.name}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
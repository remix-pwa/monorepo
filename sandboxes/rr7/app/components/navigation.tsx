import { Link, useLocation } from "react-router";
import { Home, BookmarkCheck, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/create", icon: PlusCircle, label: "Create" },
    { href: "/saved", icon: BookmarkCheck, label: "Saved" }
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-b"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            Recipe PWA
          </Link>

          <div className="flex gap-4">
            {navItems.map(({ href, icon: Icon, label }, index) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={href} className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200",
                  location.pathname === href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}>
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
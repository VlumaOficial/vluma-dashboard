"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Mail, 
  BarChart3,
  Settings
} from "lucide-react";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Leads",
    href: "/leads",
    icon: Users,
  },
  {
    name: "Agendamentos",
    href: "/calendar",
    icon: Calendar,
  },
  {
    name: "E-mails",
    href: "/emails",
    icon: Mail,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Configurações",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-card-dark via-gray-950 to-card-dark border-r border-purple-vivid/20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 right-0 w-32 h-32 bg-purple-vivid/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-0 w-24 h-24 bg-cyan-vivid/10 rounded-full blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      <div className="relative flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center justify-center px-6 py-8">
          <Logo size={60} animate={true} />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-purple-vivid/20 to-cyan-vivid/20 text-branco-puro border border-purple-vivid/30"
                    : "text-cinza-claro hover:text-branco-puro hover:bg-white/5"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 transition-colors",
                    isActive ? "text-purple-vivid" : "text-cinza-claro group-hover:text-cyan-vivid"
                  )}
                />
                {item.name}
                {isActive && (
                  <motion.div
                    className="ml-auto w-2 h-2 bg-gradient-to-r from-purple-vivid to-cyan-vivid rounded-full"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-cinza-claro text-center">
            <p className="font-semibold text-branco-suave">VLUMA Dashboard</p>
            <p>Gestão Interna de Leads</p>
          </div>
        </div>
      </div>
    </div>
  );
}

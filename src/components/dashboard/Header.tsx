"use client";

import { motion } from "framer-motion";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-card-dark/90 to-gray-950/90 backdrop-blur-xl border-b border-purple-vivid/20 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Title Section */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-branco-puro"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-cinza-claro mt-1"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cinza-claro" />
            <Input
              placeholder="Buscar leads..."
              className="pl-10 w-64 bg-white/5 border-white/20 focus:border-cyan-vivid text-branco-puro placeholder:text-cinza-claro"
            />
          </div>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-cinza-claro hover:text-branco-puro hover:bg-white/10"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-laranja-cta rounded-full text-xs flex items-center justify-center text-white">
              3
            </span>
          </Button>

          {/* User Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="text-cinza-claro hover:text-branco-puro hover:bg-white/10"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

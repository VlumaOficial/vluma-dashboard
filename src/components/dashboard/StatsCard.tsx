"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon: LucideIcon;
  gradient: string;
}

export default function StatsCard({ title, value, change, icon: Icon, gradient }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl border-purple-vivid/20 hover:border-purple-vivid/40 transition-all duration-300">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />
        
        {/* Glow Effect */}
        <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-purple-vivid/20 to-cyan-vivid/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardContent className="relative p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-cinza-claro font-medium">{title}</p>
              <p className="text-3xl font-bold text-branco-puro">{value}</p>
              {change && (
                <div className="flex items-center gap-1">
                  <span
                    className={`text-xs font-semibold ${
                      change.type === "increase" ? "text-verde-inteligente" : "text-red-400"
                    }`}
                  >
                    {change.type === "increase" ? "+" : "-"}{Math.abs(change.value)}%
                  </span>
                  <span className="text-xs text-cinza-claro">vs. mês anterior</span>
                </div>
              )}
            </div>
            
            <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-20`}>
              <Icon className="h-6 w-6 text-branco-puro" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

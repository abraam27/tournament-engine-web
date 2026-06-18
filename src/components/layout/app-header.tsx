"use client";

import { Bell, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type AppHeaderProps = {
  onMenuClick?: () => void;
};

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
        >
          <Menu className="size-5" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold tracking-tight">
              Tournament Engine
            </h1>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              World Cup 2026 Simulator
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground sm:hidden">
            World Cup 2026 Simulator
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-4" />
        </Button>
        <Button variant="outline" size="sm" className="hidden sm:inline-flex">
          Account
        </Button>
      </div>
    </header>
  );
}

"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type TeamSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function TeamSearch({ value, onChange }: TeamSearchProps) {
  return (
    <div className="relative max-w-sm">
      <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search by name or code..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="pl-8"
      />
    </div>
  );
}

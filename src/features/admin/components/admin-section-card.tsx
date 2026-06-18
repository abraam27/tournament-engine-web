import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

type AdminSectionCardProps = {
  title: string;
  description: string;
  href: string;
  icon?: LucideIcon;
};

export function AdminSectionCard({
  title,
  description,
  href,
  icon: Icon,
}: AdminSectionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4" />
            </div>
          )}
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          size="sm"
          render={<Link href={href} />}
          nativeButton={false}
        >
          Open
          <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

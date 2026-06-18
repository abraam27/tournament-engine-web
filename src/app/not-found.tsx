import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tight">404</h2>
        <p className="text-sm text-muted-foreground">
          The page you are looking for does not exist.
        </p>
      </div>
      <Link href="/">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}

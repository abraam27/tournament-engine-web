"use client";

import { useEffect, useState } from "react";

export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer React Query until after hydration so server/client markup matches.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional mount gate
    setMounted(true);
  }, []);

  return mounted;
}

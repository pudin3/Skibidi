"use client";

import { useEffect, useRef, useState } from "react";
import type { Presentation } from "@/lib/types";
import { remainingSeconds } from "@/lib/utils";

export function useCountdown(presentation: Presentation | null, onExpire: () => void) {
  const [remaining, setRemaining] = useState<number>(
    presentation ? remainingSeconds(presentation) : Infinity
  );
  const firedRef = useRef(false);

  useEffect(() => {
    firedRef.current = false;
    if (!presentation || !presentation.session_start || !presentation.duration) {
      setRemaining(Infinity);
      return;
    }

    setRemaining(remainingSeconds(presentation));
    const interval = setInterval(() => {
      const r = remainingSeconds(presentation);
      setRemaining(r);
      if (r <= 0 && !firedRef.current) {
        firedRef.current = true;
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presentation?.id, presentation?.session_start, presentation?.duration]);

  return {
    remaining,
    isRunning: Number.isFinite(remaining) && remaining > 0,
    hasSession: Boolean(presentation?.session_start && presentation?.duration),
  };
}

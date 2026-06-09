"use client";

import { useEffect, useRef } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://tunasdigitalbackend.test/api/v1";

interface Props {
  type: "article" | "page";
  slug: string;
}

export default function TrackView({ type, slug }: Props) {
  const startRef = useRef<number>(0);

  useEffect(() => {
    const basePath = type === "article" ? `/articles/${slug}` : `/pages/${slug}`;

    fetch(`${API_URL}${basePath}/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => {});

    startRef.current = Date.now();

    let sent = false;

    const sendTime = () => {
      if (sent) return;
      sent = true;

      const timeSpent = Math.round((Date.now() - startRef.current) / 1000);
      if (timeSpent < 1) return;

      const url = `${API_URL}${basePath}/track-time`;

      // URLSearchParams = application/x-www-form-urlencoded (simple CORS, no preflight)
      // sendBeacon is guaranteed to fire even during page unload
      if (typeof navigator.sendBeacon === "function") {
        navigator.sendBeacon(url, new URLSearchParams({ time_spent: String(timeSpent) }));
      } else {
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ time_spent: timeSpent }),
          keepalive: true,
        }).catch(() => {});
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") sendTime();
    };

    window.addEventListener("beforeunload", sendTime);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("beforeunload", sendTime);
      document.removeEventListener("visibilitychange", handleVisibility);
      sendTime(); // SPA navigation
    };
  }, [type, slug]);

  return null;
}

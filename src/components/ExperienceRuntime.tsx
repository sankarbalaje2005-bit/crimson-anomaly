import { useEffect, useRef } from "react";

/* ===========================================
   CRIMSON ANOMALY — PHASE 5G
   EXPERIENCE RUNTIME

   Global accessibility + performance helper.

   No navigation changes.
   No animation-frame loops.
   No custom scroll interception.
=========================================== */

type DataAwareNavigator = Navigator & {
  connection?: {
    saveData?: boolean;
    addEventListener?: (type: string, listener: EventListener) => void;
    removeEventListener?: (type: string, listener: EventListener) => void;
  };
};

export default function ExperienceRuntime() {
  const skipButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = document.documentElement;

    const navigatorWithConnection = navigator as DataAwareNavigator;

    const connection = navigatorWithConnection.connection;

    const reducedDataQuery = window.matchMedia(
      "(prefers-reduced-data: reduce)",
    );

    /* ======================================
       TAB VISIBILITY

       Decorative CSS animations are paused
       by our production stylesheet.

       Framer/Motion scene transitions
       are never altered.
    ====================================== */

    const updateVisibility = () => {
      if (document.hidden) {
        root.setAttribute("data-ca-hidden", "true");
      } else {
        root.removeAttribute("data-ca-hidden");
      }
    };

    /* ======================================
       DATA-SAVING PREFERENCES

       Respect explicit data-saving settings.
       Do not automatically punish every
       mobile visitor with reduced quality.
    ====================================== */

    const updateDataPreference = () => {
      const saveData =
        connection?.saveData === true || reducedDataQuery.matches;

      if (saveData) {
        root.setAttribute("data-ca-data-saver", "true");
      } else {
        root.removeAttribute("data-ca-data-saver");
      }
    };

    updateVisibility();
    updateDataPreference();

    document.addEventListener("visibilitychange", updateVisibility);

    reducedDataQuery.addEventListener("change", updateDataPreference);

    const onConnectionChange: EventListener = () => {
      updateDataPreference();
    };

    connection?.addEventListener?.("change", onConnectionChange);

    /* ======================================
       CLEANUP

       Safe under React StrictMode.
    ====================================== */

    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);

      reducedDataQuery.removeEventListener("change", updateDataPreference);

      connection?.removeEventListener?.("change", onConnectionChange);

      root.removeAttribute("data-ca-hidden");
      root.removeAttribute("data-ca-data-saver");
    };
  }, []);

  /* ======================================
     SKIP TO CONTENT

     Uses focus rather than changing URL hash.
     This is important because Home.tsx uses
     location.hash for chapter navigation.
  ====================================== */

  const skipToContent = () => {
    const target =
      document.querySelector<HTMLElement>("#main-content") ??
      document.querySelector<HTMLElement>("main");

    if (!target) return;

    // Make the destination programmatically
    // focusable without changing tab order.
    target.tabIndex = -1;

    target.focus({
      preventScroll: true,
    });
  };

  return (
    <button
      ref={skipButtonRef}
      type="button"
      className="ca-skip-link"
      onClick={skipToContent}
    >
      Skip to main content
    </button>
  );
}

import { onCLS, onINP, onLCP } from "web-vitals";

import type { Metric } from "web-vitals";

/* ==========================================
   CRIMSON ANOMALY — PHASE 5H
   OPT-IN PERFORMANCE DIAGNOSTICS

   No analytics endpoint.
   No user data transmitted.

   Reports to browser DevTools only.
========================================== */

let initialized = false;

function reportMetric(metric: Metric) {
  const value =
    metric.name === "CLS"
      ? metric.value.toFixed(3)
      : `${metric.value.toFixed(0)} ms`;

  const label = `[Crimson Anomaly] ${metric.name}`;

  const details = {
    metric: metric.name,
    value,
    rating: metric.rating,
    navigationType: metric.navigationType,
    id: metric.id,
  };

  if (metric.rating === "poor") {
    console.warn(label, details);
    return;
  }

  console.info(label, details);
}

export function startVitalsDiagnostics() {
  if (initialized) return;

  initialized = true;

  onLCP(reportMetric);
  onINP(reportMetric);
  onCLS(reportMetric);
}

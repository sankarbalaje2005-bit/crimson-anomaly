import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router";

import App from "./App";

import ExperienceRuntime from "./components/ExperienceRuntime";

/* ==========================================
   CRIMSON ANOMALY
   EXISTING BASE STYLES
========================================== */

import "./styles/globals.css";
import "./styles/hero3d.css";
import "./styles/chapters.css";
import "./styles/route-transitions.css";
import "./styles/scene-polish.css";
import "./styles/zoom-repair.css";

/* ==========================================
   PHASE 5A — CINEMATIC LIGHTING
========================================== */

import "./styles/sentinel-cinematic.css";

/* ==========================================
   PHASE 5B — REACTIVE 2.5D MOTION
========================================== */

import "./styles/sentinel-motion.css";

/* ==========================================
   PHASE 5C — CINEMATIC CHAPTER PORTALS
========================================== */

import "./styles/chapter-cinematic.css";

/* ==========================================
   PHASE 5D — CHAPTER ARTIFACTS
========================================== */

import "./styles/chapter-artifacts.css";

/* ==========================================
   PHASE 5E — CINEMATIC INTERFACE
========================================== */

import "./styles/chapter-interface.css";

/* ==========================================
   PHASE 5F — PRECISION INTERACTION
========================================== */

import "./styles/chapter-precision.css";

/* ==========================================
   PHASE 5G — PRODUCTION POLISH
========================================== */

import "./styles/production-polish.css";

/* ==========================================
   APPLICATION ENTRY POINT
========================================== */

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Crimson Anomaly: #root element not found.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Global accessibility + performance */}
      <ExperienceRuntime />

      {/* Existing application and all routes */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

/* ==========================================
   PHASE 5H — OPTIONAL WEB VITALS

   Open:
   ?diagnostics=1

   No monitoring code is loaded during
   normal production visits.
========================================== */

const diagnosticsEnabled = new URLSearchParams(window.location.search).has(
  "diagnostics",
);

if (diagnosticsEnabled) {
  void import("./performance/vitals").then(({ startVitalsDiagnostics }) => {
    startVitalsDiagnostics();
  });
}

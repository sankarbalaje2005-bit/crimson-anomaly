import { Suspense, lazy } from "react";

import { Route, Routes, useLocation, useNavigationType } from "react-router";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import SceneReactor from "./components/SceneReactor";
import Home from "./pages/Home";

const Lab = lazy(() => import("./pages/Lab"));
const Dimension = lazy(() => import("./pages/Dimension"));
const Project = lazy(() => import("./pages/Project"));
const NotFound = lazy(() => import("./pages/NotFound"));

const routeVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    scale: direction > 0 ? 0.76 : 1.28,
    filter: "blur(10px)",
  }),

  active: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },

  exit: (direction: number) => ({
    opacity: 0,
    scale: direction > 0 ? 1.28 : 0.76,
    filter: "blur(10px)",
  }),
};

function RouteContent() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const reducedMotion = Boolean(useReducedMotion());

  const isHome = location.pathname === "/";

  const direction = navigationType === "POP" || isHome ? -1 : 1;

  return (
    <AnimatePresence initial={false} mode="sync" custom={direction}>
      <motion.div
        key={location.pathname}
        className={
          isHome
            ? "route-scene route-scene--home"
            : "route-scene route-scene--page"
        }
        variants={routeVariants}
        custom={direction}
        initial={reducedMotion ? { opacity: 0, scale: 1 } : "enter"}
        animate={reducedMotion ? { opacity: 1, scale: 1 } : "active"}
        exit={reducedMotion ? { opacity: 0, scale: 1 } : "exit"}
        transition={{
          duration: reducedMotion ? 0.18 : 0.85,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Suspense
          fallback={
            <main id="main-content" className="subpage container">
              Loading experience…
            </main>
          }
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/dimension" element={<Dimension />} />
            <Route path="/projects/:slug" element={<Project />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>

        {!isHome && <SiteFooter />}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <SiteHeader />

      <RouteContent />

      <SceneReactor />
    </>
  );
}

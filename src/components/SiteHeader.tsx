import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router";

const links = [
  { label: "About", to: "/#about" },
  { label: "Skills", to: "/#skills" },
  { label: "Projects", to: "/#projects" },
  { label: "Journey", to: "/#journey" },
  { label: "Lab", to: "/lab" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="site-header">
      <Link
        to="/"
        className="wordmark"
        aria-label="Sankar Balaje home"
        onClick={() => setMenuOpen(false)}
      >
        <span className="wordmark-mark" aria-hidden="true">
          SB<span className="accent">.</span>
        </span>

        <span className="wordmark-caption">BEYOND THE SCREEN</span>
      </Link>

      <button
        className="mobile-menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? "Close" : "Menu"}
      </button>

      <nav
        id="primary-navigation"
        aria-label="Primary navigation"
        className={`nav-links ${menuOpen ? "is-open" : ""}`}
      >
        {links.map((link) =>
          link.to.startsWith("/#") ? (
            <a
              key={link.label}
              href={pathname === "/" ? link.to.slice(1) : link.to}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ) : (
            <NavLink
              key={link.label}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              {link.label}
            </NavLink>
          ),
        )}

        <a
          className="nav-contact"
          href={pathname === "/" ? "#contact" : "/#contact"}
          onClick={() => setMenuOpen(false)}
        >
          Connect
          <span aria-hidden="true"> ↗</span>
        </a>
      </nav>
    </header>
  );
}

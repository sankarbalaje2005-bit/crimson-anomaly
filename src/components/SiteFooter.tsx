import { Link } from "react-router";
import { identity } from "../data/site";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>
        © {new Date().getFullYear()} {identity.name}
      </span>

      <span>Designed and engineered with intent.</span>

      <Link to="/">Return to the signal ↑</Link>
    </footer>
  );
}

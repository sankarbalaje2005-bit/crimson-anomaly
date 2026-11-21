import { Link } from "react-router";

export default function Dimension() {
  return (
    <main id="main-content" className="subpage container">
      <span className="section-index">HIDDEN SYSTEM / 002</span>

      <h1>
        THE HIDDEN
        <br />
        <em>DIMENSION.</em>
      </h1>

      <p>
        This route is reserved for the optional secret Three.js scene. The full
        experience will be implemented in a later phase.
      </p>

      <Link className="button-primary" to="/lab">
        Exit dimension ↗
      </Link>
    </main>
  );
}

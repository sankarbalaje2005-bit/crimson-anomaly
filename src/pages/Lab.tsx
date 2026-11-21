import { Link } from "react-router";

export default function Lab() {
  return (
    <main id="main-content" className="subpage container">
      <span className="section-index">EXPERIMENTAL ROUTE / 001</span>

      <h1>
        THE
        <br />
        <em>MOTION LAB.</em>
      </h1>

      <p>
        The foundation for our upcoming interaction experiments is ready.
        Fragment physics, kinetic typography, and spatial UI will be built in
        their dedicated phase.
      </p>

      <Link className="button-primary" to="/">
        Return to the signal ↗
      </Link>
    </main>
  );
}

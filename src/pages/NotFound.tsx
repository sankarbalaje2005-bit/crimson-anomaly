import { Link } from "react-router";

export default function NotFound() {
  return (
    <main id="main-content" className="subpage container">
      <span className="section-index">ERROR / 404</span>

      <h1>
        SIGNAL
        <br />
        <em>NOT FOUND.</em>
      </h1>

      <p>This route doesn't exist in the current dimension.</p>

      <Link className="button-primary" to="/">
        Return home ↗
      </Link>
    </main>
  );
}

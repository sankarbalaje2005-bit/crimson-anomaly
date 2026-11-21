import { Link, useParams } from "react-router";

import { projects } from "../data/site";

export default function Project() {
  const { slug } = useParams();

  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return (
      <main id="main-content" className="subpage container">
        <h1>Project not found.</h1>

        <Link className="button-quiet" to="/#projects">
          Back to projects ↗
        </Link>
      </main>
    );
  }

  return (
    <main id="main-content" className="subpage container">
      <span className="section-index">
        PROJECT ARTIFACT / {project.label.toUpperCase()}
      </span>

      <h1>
        {project.title}
        <span className="accent">.</span>
      </h1>

      <p>{project.description}</p>

      <p className="subtle">
        Verified case-study details and media can be added here in the project
        exhibition phase. No features or metrics have been invented.
      </p>

      <div className="hero-actions">
        {project.github && (
          <a
            href={project.github}
            className="button-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source code ↗
          </a>
        )}

        {project.live && (
          <a
            href={project.live}
            className="button-quiet"
            target="_blank"
            rel="noopener noreferrer"
          >
            Live project ↗
          </a>
        )}

        <Link to="/#projects" className="button-quiet">
          All projects ←
        </Link>
      </div>
    </main>
  );
}

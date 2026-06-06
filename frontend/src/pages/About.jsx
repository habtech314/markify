import { GitHubIcon } from "../components/Icons";

export default function About() {
  const tech = ["React", "FastAPI", "MarkItDown", "Vite", "Vercel", "Render"];

  return (
    <div className="about-page page">
      <div className="about-hero">
        <h1>Built by one developer, for everyone.</h1>
        <p>
          Markify is a free, open-source tool that turns any file into clean
          Markdown.
        </p>
      </div>
      <div className="about-body">
        <div>
          <div className="about-section-title">The Story</div>
          <p className="about-section-text">
            Markify started as a personal tool to convert coffee class lecture
            slides into Obsidian notes. What began as a quick script grew into a
            free tool for anyone who needs clean Markdown from any file — PDFs,
            presentations, spreadsheets, or web pages.
          </p>
        </div>

        <div>
          <div className="about-section-title">Built With</div>
          <div className="tech-tags">
            {tech.map((t) => (
              <span className="tech-tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="about-section-title">Open Source</div>
          <p className="about-section-text" style={{ marginBottom: "16px" }}>
            Markify is fully open source. The code is available on GitHub for
            anyone to inspect, fork, or contribute to.
          </p>
          <a
            href="https://github.com/habtech314/markify"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ display: "inline-flex", textDecoration: "none" }}
          >
            <GitHubIcon /> View on GitHub
          </a>
        </div>

        <div>
          <div className="about-section-title">Creator</div>
          <div className="creator-card">
            <div className="creator-avatar">H</div>
            <div className="creator-info">
              <div className="creator-name">Habte</div>
              <div className="creator-desc">
                Developer and coffee enthusiast. Based in Addis Ababa, Ethiopia.
                Building tools that make information more accessible.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

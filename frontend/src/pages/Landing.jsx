import { UploadIcon, DownloadIcon, ArrowRightIcon, ChevronRightIcon } from "../components/Icons";

export default function Landing({ navigate }) {
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-left">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            free & open source
          </div>
          <h1 className="hero-title">
            Turn any file into<br />
            <em>clean markdown.</em>
          </h1>
          <p className="hero-sub">
            Drop a PDF, PowerPoint, Word doc, or spreadsheet — get back structured
            Markdown in seconds. No accounts, no limits, no fuss.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate("convert")}>
              Convert a file <ArrowRightIcon />
            </button>
            <button className="btn-ghost" onClick={() => navigate("history")}>
              View history
            </button>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-code-label">// output preview</div>
          <pre className="hero-code">
            <span className="hl-green"># Ethiopian Green Coffee</span>{"\n"}
            <span className="hl-white">A beginner guide to grading.</span>{"\n\n"}
            <span className="hl-green">## Grade 1 (Specialty)</span>{"\n\n"}
            <span className="hl-white">| Washed | Natural |</span>{"\n"}
            <span className="hl-white">|--------|---------|</span>{"\n"}
            <span className="hl-white">| 0–3    | 0–15    |</span>{"\n\n"}
            <span className="hl-gray">{"<!-- Slide 6 of 18 -->"}</span>
          </pre>
        </div>
      </section>

      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-number">10+</div>
          <div className="stat-label">Formats supported</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">100%</div>
          <div className="stat-label">Free to use</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">Open</div>
          <div className="stat-label">Source code</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">No</div>
          <div className="stat-label">Signup needed</div>
        </div>
      </div>

      <div className="formats-bar">
        {[
          { ext: "PDF", label: "documents" },
          { ext: "PPTX", label: "presentations" },
          { ext: "DOCX", label: "word docs" },
          { ext: "XLSX", label: "spreadsheets" },
          { ext: "HTML", label: "web pages" },
          { ext: "URL", label: "any link" },
        ].map((f) => (
          <div className="format-chip" key={f.ext}>
            {f.ext}
            <span>{f.label}</span>
          </div>
        ))}
      </div>

      <div className="features-grid">
        {[
          {
            n: "01",
            t: "Drop any file",
            d: "PDF, PPTX, DOCX, XLSX, HTML — MarkItDown handles them all with Microsoft's open-source conversion engine.",
          },
          {
            n: "02",
            t: "Get clean Markdown",
            d: "Headings, tables, lists, code blocks — all preserved and structured. Perfect for AI pipelines and Obsidian vaults.",
          },
          {
            n: "03",
            t: "Copy or download",
            d: "One click to copy to clipboard or download as a .md file. Your conversion history stays in your browser.",
          },
        ].map((f) => (
          <div className="feature-card" key={f.n}>
            <div className="feature-num">{f.n}</div>
            <div className="feature-title">{f.t}</div>
            <p className="feature-desc">{f.d}</p>
          </div>
        ))}
      </div>

      <div className="social-proof">
        <p>Trusted by developers, researchers, and students worldwide.</p>
      </div>

      <div className="how-works">
        <div className="how-works-title">How it works</div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon">
              <UploadIcon />
            </div>
            <div className="step-num">STEP 01</div>
            <div className="step-title">Upload a file</div>
            <p className="step-desc">
              Drag and drop any file — PDF, DOCX, PPTX, XLSX — or paste a URL.
            </p>
          </div>
          <div className="step-card">
            <div className="step-icon">
              <ChevronRightIcon />
            </div>
            <div className="step-num">STEP 02</div>
            <div className="step-title">Convert instantly</div>
            <p className="step-desc">
              MarkItDown extracts the content and turns it into clean Markdown.
            </p>
          </div>
          <div className="step-card">
            <div className="step-icon">
              <DownloadIcon />
            </div>
            <div className="step-num">STEP 03</div>
            <div className="step-title">Copy or download</div>
            <p className="step-desc">
              Copy to clipboard, download as .md, or save to your history.
            </p>
          </div>
        </div>
      </div>

      <div className="cta-strip">
        <h2>Ready to convert?</h2>
        <button className="btn-primary" onClick={() => navigate("convert")}>
          Open converter <ArrowRightIcon />
        </button>
      </div>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-copy">© 2026 Markify</div>
          <div className="footer-links">
            <a
              className="footer-link"
              href="https://github.com/habtech314/markify"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <button className="footer-link" onClick={() => navigate("about")}>
              About
            </button>
            <button className="footer-link" onClick={() => navigate("pricing")}>
              Pricing
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

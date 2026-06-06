export default function Landing({ navigate }) {
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-left">
          <div className="hero-badge"><span className="hero-badge-dot" />free & open source</div>
          <h1 className="hero-title">Any file.<br />Pure <em>markdown.</em><br />Instantly.</h1>
          <p className="hero-sub">Drop a PDF, PowerPoint, Word doc, or spreadsheet — get back clean, structured Markdown in seconds. No accounts. No limits.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate("convert")}>Convert a file →</button>
            <button className="btn-ghost" onClick={() => navigate("history")}>View history</button>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-code-label">// output preview</div>
          <pre className="hero-code"><span className="hl-green"># Ethiopian Green Coffee</span>{"\n"}<span className="hl-white">A beginner guide to grading.</span>{"\n\n"}<span className="hl-green">## Grade 1 (Specialty)</span>{"\n\n"}<span className="hl-white">| Washed | Natural |</span>{"\n"}<span className="hl-white">|--------|---------|</span>{"\n"}<span className="hl-white">| 0–3    | 0–15    |</span>{"\n\n"}<span className="hl-gray">{"<!-- Slide 6 of 18 -->"}</span></pre>
        </div>
      </section>
      <div className="formats-bar">
        {[{ext:"PDF",label:"documents"},{ext:"PPTX",label:"presentations"},{ext:"DOCX",label:"word docs"},{ext:"XLSX",label:"spreadsheets"},{ext:"HTML",label:"web pages"},{ext:"URL",label:"any link"}].map(f => (
          <div className="format-chip" key={f.ext}>{f.ext}<span>{f.label}</span></div>
        ))}
      </div>
      <div className="features-grid">
        {[{n:"01",t:"Drop any file",d:"PDF, PPTX, DOCX, XLSX, HTML — MarkItDown handles them all with Microsoft's open-source conversion engine."},{n:"02",t:"Get clean Markdown",d:"Headings, tables, lists, code blocks — all preserved and structured. Perfect for AI pipelines and Obsidian vaults."},{n:"03",t:"Copy or download",d:"One click to copy to clipboard or download as a .md file. Your conversion history stays in your browser."}].map(f => (
          <div className="feature-card" key={f.n}><div className="feature-num">{f.n}</div><div className="feature-title">{f.t}</div><p className="feature-desc">{f.d}</p></div>
        ))}
      </div>
      <div className="cta-strip">
        <h2>Ready to convert?</h2>
        <button className="btn-dark" onClick={() => navigate("convert")}>Open converter →</button>
      </div>
    </div>
  );
}

import { useState, useRef } from "react";

const EXT_MAP = {
  pdf: "PDF", pptx: "PPT", ppt: "PPT", docx: "DOC", doc: "DOC",
  xlsx: "XLS", xls: "XLS", html: "HTM", htm: "HTM", txt: "TXT", md: "MD",
};

function getExt(filename) {
  return filename.split(".").pop().toLowerCase();
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function Convert({ addToHistory }) {
  const [file, setFile] = useState(null);
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => {
    setFile(f);
    setMarkdown("");
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setMarkdown("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://markify-1.onrender.com/convert", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setMarkdown(data.markdown);
      addToHistory({
        filename: file.name,
        ext: getExt(file.name),
        size: file.size,
        markdown: data.markdown,
        date: new Date().toLocaleString(),
        chars: data.markdown.length,
      });
    } catch {
      setError("Could not reach backend. Is it running on port 8000?");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.[^.]+$/, "") + ".md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const ext = file ? (EXT_MAP[getExt(file.name)] || "FILE") : null;

  return (
    <div className="convert-page">
      <div className="convert-header">
        <h1>Convert</h1>
        <p>Upload a file and get clean Markdown back in seconds.</p>
      </div>

      <div className="convert-body">
        {/* LEFT: Upload panel */}
        <div className="upload-panel">
          <div
            className={`drop-zone ${dragOver ? "drag-over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
          >
            <div className="drop-icon">📂</div>
            <div className="drop-title">Drop your file here</div>
            <div className="drop-sub">PDF, PPTX, DOCX, XLSX, HTML supported</div>
            <div className="drop-btn">Browse files</div>
            <input
              ref={inputRef} type="file" style={{ display: "none" }}
              onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
            />
          </div>

          {file && (
            <div className="file-pill">
              <div className="file-pill-icon">{ext}</div>
              <div>
                <div className="file-pill-name">{file.name}</div>
                <div className="file-pill-size">{formatSize(file.size)}</div>
              </div>
              <button className="file-pill-remove" onClick={() => { setFile(null); setMarkdown(""); }}>×</button>
            </div>
          )}

          {error && (
            <div style={{ color: "var(--red)", fontSize: "13px", padding: "12px 16px", background: "#fff0f0", borderRadius: "var(--radius)", border: "1px solid #ffc0c0" }}>
              {error}
            </div>
          )}

          <button
            className={`convert-btn ${loading ? "loading" : ""}`}
            onClick={handleConvert}
            disabled={!file || loading}
          >
            {loading ? "Converting…" : "Convert to Markdown →"}
          </button>

          <div style={{ marginTop: "auto", padding: "16px", background: "var(--white)", border: "var(--border)", borderRadius: "var(--radius-lg)" }}>
            <div style={{ fontSize: "11px", fontFamily: "'DM Mono', monospace", color: "var(--ink3)", marginBottom: "8px", letterSpacing: "0.5px" }}>SUPPORTED FORMATS</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {["PDF", "PPTX", "DOCX", "XLSX", "HTML", "TXT", "CSV", "JSON"].map(f => (
                <span key={f} style={{ fontSize: "11px", fontFamily: "'DM Mono', monospace", background: "var(--paper2)", padding: "3px 8px", borderRadius: "var(--radius)", color: "var(--ink2)" }}>{f}</span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Output panel */}
        <div className="output-panel">
          <div className="output-header">
            <div className="output-label">
              {markdown ? `Output · ${markdown.length.toLocaleString()} chars` : "Output"}
            </div>
            {markdown && (
              <div className="output-actions">
                <button className={`action-btn ${copied ? "copied" : ""}`} onClick={handleCopy}>
                  {copied ? "✓ copied" : "copy"}
                </button>
                <button className="action-btn" onClick={handleDownload}>↓ .md</button>
              </div>
            )}
          </div>

          {markdown ? (
            <textarea className="output-area" readOnly value={markdown} />
          ) : (
            <div className="output-empty">
              <div className="output-empty-icon">↓</div>
              <div className="output-empty-text">
                {loading ? "Converting your file…" : "Your markdown will appear here"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState, useRef } from "react";
import { UploadIcon, CopyIcon, CheckIcon, DownloadIcon, LinkIcon } from "../components/Icons";

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
  const [uploadTab, setUploadTab] = useState("file");
  const [url, setUrl] = useState("");
  const [outputTab, setOutputTab] = useState("raw");
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
    if (uploadTab === "file" && !file) return;
    if (uploadTab === "url" && !url.trim()) return;

    setLoading(true);
    setError("");
    setMarkdown("");

    try {
      let data;
      if (uploadTab === "url") {
        const res = await fetch("https://markify-1.onrender.com/convert-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
        });
        if (!res.ok) throw new Error("Server error");
        data = await res.json();
        addToHistory({
          filename: url.trim(),
          ext: "URL",
          size: 0,
          markdown: data.markdown,
          date: new Date().toLocaleString(),
          chars: data.markdown.length,
        });
      } else {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("https://markify-1.onrender.com/convert", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Server error");
        data = await res.json();
        addToHistory({
          filename: file.name,
          ext: getExt(file.name),
          size: file.size,
          markdown: data.markdown,
          date: new Date().toLocaleString(),
          chars: data.markdown.length,
        });
      }
      setMarkdown(data.markdown);
    } catch {
      setError("Could not reach backend. Is the server running?");
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
    const url2 = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url2;
    const name = file ? file.name.replace(/\.[^.]+$/, "") : "converted";
    a.download = name + ".md";
    a.click();
    URL.revokeObjectURL(url2);
  };

  const ext = file ? EXT_MAP[getExt(file.name)] || "FILE" : null;

  const renderedHTML = (() => {
    try {
      return window.marked ? window.marked.parse(markdown) : markdown;
    } catch {
      return markdown;
    }
  })();

  return (
    <div className="convert-page page">
      <div className="page-header">
        <h1>Convert</h1>
        <p>Upload a file or enter a URL to get clean Markdown in seconds.</p>
      </div>

      <div className="convert-body">
        {/* LEFT: Upload panel */}
        <div className="upload-panel">
          <div className="tabs">
            <button
              className={`tab ${uploadTab === "file" ? "active" : ""}`}
              onClick={() => { setUploadTab("file"); setError(""); }}
            >
              Upload file
            </button>
            <button
              className={`tab ${uploadTab === "url" ? "active" : ""}`}
              onClick={() => { setUploadTab("url"); setError(""); }}
            >
              From URL
            </button>
          </div>

          {uploadTab === "file" ? (
            <>
              <div
                className={`drop-zone ${dragOver ? "drag-over" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current.click()}
              >
                <div className="drop-icon">
                  <UploadIcon />
                </div>
                <div className="drop-title">Drop your file here</div>
                <div className="drop-sub">PDF, PPTX, DOCX, XLSX, HTML supported</div>
                <div className="drop-btn">Browse files</div>
                <input
                  ref={inputRef}
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) =>
                    e.target.files[0] && handleFile(e.target.files[0])
                  }
                />
              </div>

              {file && (
                <div className="file-pill">
                  <div className="file-pill-icon">{ext}</div>
                  <div>
                    <div className="file-pill-name">{file.name}</div>
                    <div className="file-pill-size">{formatSize(file.size)}</div>
                  </div>
                  <button
                    className="file-pill-remove"
                    onClick={() => { setFile(null); setMarkdown(""); }}
                  >
                    ×
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="url-input-wrap">
              <input
                className="url-input"
                type="url"
                placeholder="Paste a URL… e.g. https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          )}

          {error && (
            <div
              style={{
                color: "var(--destructive)",
                fontSize: "13px",
                padding: "12px 16px",
                background: "rgba(239, 68, 68, 0.1)",
                borderRadius: "var(--radius)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
              }}
            >
              {error}
            </div>
          )}

          <button
            className={`convert-btn ${loading ? "loading" : ""}`}
            onClick={handleConvert}
            disabled={
              loading ||
              (uploadTab === "file" && !file) ||
              (uploadTab === "url" && !url.trim())
            }
          >
            {loading
              ? "Converting…"
              : uploadTab === "url"
                ? "Convert URL →"
                : "Convert to Markdown →"}
          </button>

          <div className="formats-card">
            <div className="formats-label">Supported formats</div>
            <div className="formats-tags">
              {["PDF", "PPTX", "DOCX", "XLSX", "HTML", "TXT", "CSV", "JSON"].map(
                (f) => (
                  <span className="format-tag" key={f}>
                    {f}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Output panel */}
        <div className="output-panel">
          <div className="output-header">
            <div className="tabs" style={{ marginBottom: 0, borderBottom: "none" }}>
              <button
                className={`tab ${outputTab === "raw" ? "active" : ""}`}
                onClick={() => setOutputTab("raw")}
              >
                Raw
              </button>
              <button
                className={`tab ${outputTab === "preview" ? "active" : ""}`}
                onClick={() => setOutputTab("preview")}
                disabled={!markdown}
                style={!markdown ? { opacity: 0.35, cursor: "not-allowed" } : {}}
              >
                Preview
              </button>
            </div>
            {markdown && (
              <div className="output-actions">
                <button
                  className={`action-btn ${copied ? "copied" : ""}`}
                  onClick={handleCopy}
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button className="action-btn" onClick={handleDownload}>
                  <DownloadIcon /> .md
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="skeleton">
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line-wide" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line-wide" />
              <div className="skeleton-line" />
            </div>
          ) : markdown ? (
            outputTab === "raw" ? (
              <textarea className="output-area" readOnly value={markdown} />
            ) : (
              <div
                className="output-preview"
                dangerouslySetInnerHTML={{ __html: renderedHTML }}
              />
            )
          ) : (
            <div className="output-empty">
              <UploadIcon />
              <div className="output-empty-text">
                Your markdown will appear here
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

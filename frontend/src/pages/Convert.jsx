import { useState, useRef, useCallback } from "react";
import { UploadIcon, CopyIcon, CheckIcon, DownloadIcon } from "../components/Icons";

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
  const [files, setFiles] = useState([]);
  const [markdowns, setMarkdowns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [uploadTab, setUploadTab] = useState("file");
  const [url, setUrl] = useState("");
  const [activeResult, setActiveResult] = useState(0);
  const [outputTab, setOutputTab] = useState("raw");
  const [copiedIdx, setCopiedIdx] = useState(null);
  const inputRef = useRef();

  const addFiles = useCallback((incoming) => {
    const newFiles = Array.from(incoming).filter(
      (f) => !files.some((ef) => ef.file.name === f.name && ef.file.size === f.size)
    );
    if (newFiles.length === 0) return;
    setFiles((prev) => [
      ...prev,
      ...newFiles.map((f) => ({ file: f, status: "pending" })),
    ]);
    setMarkdowns([]);
    setActiveResult(0);
    setError("");
  }, [files]);

  const removeFile = useCallback((idx) => {
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      return next;
    });
    setMarkdowns([]);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleBrowse = (e) => {
    if (e.target.files.length > 0) {
      addFiles(e.target.files);
    }
    e.target.value = "";
  };

  const handleConvert = async () => {
    if (uploadTab === "url") {
      if (!url.trim()) return;
      setLoading(true);
      setError("");
      setMarkdowns([]);
      setFiles([]);
      try {
        const res = await fetch("https://markify-1.onrender.com/convert-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
        });
        if (!res.ok) throw new Error("Server error");
        const data = await res.json();
        const result = {
          filename: url.trim(),
          ext: "URL",
          markdown: data.markdown,
          chars: data.markdown.length,
          date: new Date().toLocaleString(),
        };
        setMarkdowns([result]);
        setActiveResult(0);
        addToHistory({
          filename: result.filename,
          ext: "URL",
          size: 0,
          markdown: result.markdown,
          date: result.date,
          chars: result.chars,
        });
      } catch {
        setError("Could not reach backend. Is the server running?");
      } finally {
        setLoading(false);
      }
      return;
    }

    const pending = files.filter((f) => f.status === "pending");
    if (pending.length === 0) return;

    setLoading(true);
    setError("");
    setMarkdowns([]);
    setActiveResult(0);

    setFiles((prev) =>
      prev.map((f) =>
        f.status === "pending" ? { ...f, status: "converting" } : f
      )
    );

    const formData = new FormData();
    pending.forEach((f) => formData.append("files", f.file));

    try {
      const res = await fetch("https://markify-1.onrender.com/convert-batch", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();

      const results = data.results.map((r) => ({
        filename: r.filename,
        ext: EXT_MAP[getExt(r.filename)] || "FILE",
        markdown: r.markdown,
        chars: r.markdown.length,
        date: new Date().toLocaleString(),
      }));

      setMarkdowns(results);
      setActiveResult(0);

      setFiles((prev) =>
        prev.map((f) => {
          const match = results.find(
            (r) =>
              r.filename === f.file.name &&
              f.status === "converting"
          );
          return match ? { ...f, status: "done" } : f;
        })
      );

      results.forEach((r) => {
        addToHistory({
          filename: r.filename,
          ext: r.ext,
          size: pending.find((p) => p.file.name === r.filename)?.file.size || 0,
          markdown: r.markdown,
          date: r.date,
          chars: r.chars,
        });
      });
    } catch {
      setError("Could not reach backend. Is the server running?");
      setFiles((prev) =>
        prev.map((f) =>
          f.status === "converting" ? { ...f, status: "pending" } : f
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (idx) => {
    navigator.clipboard.writeText(markdowns[idx].markdown);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  const handleDownload = (idx) => {
    const md = markdowns[idx];
    const blob = new Blob([md.markdown], { type: "text/markdown" });
    const url2 = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url2;
    a.download = md.filename.replace(/\.[^.]+$/, "") + ".md";
    a.click();
    URL.revokeObjectURL(url2);
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const convertingCount = files.filter((f) => f.status === "converting").length;

  const showResults = markdowns.length > 0;

  const renderedHTML = (() => {
    if (!showResults) return "";
    try {
      return window.marked
        ? window.marked.parse(markdowns[activeResult].markdown)
        : markdowns[activeResult].markdown;
    } catch {
      return markdowns[activeResult].markdown;
    }
  })();

  return (
    <div className="convert-page page">
      <div className="page-header">
        <h1>Convert</h1>
        <p>Upload files or enter a URL to get clean Markdown in seconds.</p>
      </div>

      <div className="convert-body">
        {/* LEFT: Upload panel */}
        <div className="upload-panel">
          <div className="tabs">
            <button
              className={`tab ${uploadTab === "file" ? "active" : ""}`}
              onClick={() => { setUploadTab("file"); setError(""); }}
            >
              Upload files
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
                <div className="drop-title">Drop files here</div>
                <div className="drop-sub">
                  PDF, PPTX, DOCX, XLSX, HTML supported
                </div>
                <div className="drop-btn">Browse files</div>
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleBrowse}
                />
              </div>

              {files.length > 0 && (
                <div className="file-list">
                  {files.map((f, i) => (
                    <div className="file-pill" key={`${f.file.name}-${i}`}>
                      <div className="file-pill-icon">
                        {EXT_MAP[getExt(f.file.name)] || "FILE"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="file-pill-name">{f.file.name}</div>
                        <div className="file-pill-size">
                          {formatSize(f.file.size)}
                        </div>
                      </div>
                      {f.status === "done" && (
                        <span className="file-pill-status done">Done</span>
                      )}
                      {f.status === "converting" && (
                        <span className="file-pill-status converting">
                          Converting…
                        </span>
                      )}
                      {f.status === "pending" && (
                        <button
                          className="file-pill-remove"
                          onClick={() => removeFile(i)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
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
              (uploadTab === "file" && pendingCount === 0) ||
              (uploadTab === "url" && !url.trim())
            }
          >
            {loading
              ? convertingCount > 0
                ? `Converting ${convertingCount} file${convertingCount > 1 ? "s" : ""}…`
                : "Converting…"
              : uploadTab === "url"
                ? "Convert URL →"
                : pendingCount > 0
                  ? `Convert ${pendingCount} file${pendingCount > 1 ? "s" : ""} →`
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
          {showResults && markdowns.length > 1 && (
            <div className="result-tabs">
              {markdowns.map((md, i) => (
                <button
                  key={i}
                  className={`result-tab ${activeResult === i ? "active" : ""}`}
                  onClick={() => { setActiveResult(i); setOutputTab("raw"); }}
                >
                  {md.filename.length > 24
                    ? md.filename.slice(0, 22) + "…"
                    : md.filename}
                  <span className="result-tab-count">{md.chars.toLocaleString()}</span>
                </button>
              ))}
            </div>
          )}

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
                disabled={!showResults}
                style={!showResults ? { opacity: 0.35, cursor: "not-allowed" } : {}}
              >
                Preview
              </button>
            </div>
            {showResults && (
              <div className="output-actions">
                <button
                  className={`action-btn ${copiedIdx === activeResult ? "copied" : ""}`}
                  onClick={() => handleCopy(activeResult)}
                >
                  {copiedIdx === activeResult ? <CheckIcon /> : <CopyIcon />}
                  {copiedIdx === activeResult ? "Copied" : "Copy"}
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleDownload(activeResult)}
                >
                  <DownloadIcon /> .md
                </button>
              </div>
            )}
          </div>

          {files.some((f) => f.status === "converting") || (loading && uploadTab === "url") ? (
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
          ) : showResults ? (
            outputTab === "raw" ? (
              <textarea
                className="output-area"
                readOnly
                value={markdowns[activeResult].markdown}
              />
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
                {files.length > 0
                  ? "Hit convert to see results"
                  : "Drop files or paste a URL to begin"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

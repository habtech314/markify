const EXT_MAP = {
  pdf: "PDF", pptx: "PPT", ppt: "PPT", docx: "DOC", doc: "DOC",
  xlsx: "XLS", xls: "XLS", html: "HTM", htm: "HTM", txt: "TXT", md: "MD",
};

function getExt(filename) {
  return EXT_MAP[filename.split(".").pop().toLowerCase()] || "FILE";
}

export default function Dashboard({ navigate, history }) {
  const totalConversions = history.length;
  const totalChars = history.reduce((sum, item) => sum + (item.chars || 0), 0);

  const extCounts = {};
  history.forEach((item) => {
    const e = getExt(item.filename);
    extCounts[e] = (extCounts[e] || 0) + 1;
  });

  const mostUsedFormat = Object.entries(extCounts).sort((a, b) => b[1] - a[1])[0];
  const lastConversion = history.length > 0 ? history[0].date : null;

  const sortedExts = Object.entries(extCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = sortedExts.length > 0 ? sortedExts[0][1] : 1;

  const lastFive = history.slice(0, 5);

  return (
    <div className="dashboard-page page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>
          {totalConversions} conversion{totalConversions !== 1 ? "s" : ""} this session
        </p>
      </div>
      <div className="dashboard-body">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-value">{totalConversions}</div>
            <div className="stat-card-label">Total Conversions</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-value">{totalChars.toLocaleString()}</div>
            <div className="stat-card-label">Total Characters</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-value">
              {mostUsedFormat ? mostUsedFormat[0] : "—"}
            </div>
            <div className="stat-card-label">Most Used Format</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-value" style={{ fontSize: "15px", letterSpacing: "-0.2px" }}>
              {lastConversion || "—"}
            </div>
            <div className="stat-card-label">Last Conversion</div>
          </div>
        </div>

        {history.length > 0 && (
          <>
            <div>
              <div className="chart-title">Conversions by File Type</div>
              <div className="chart">
                {sortedExts.map(([ext, count]) => (
                  <div className="chart-row" key={ext}>
                    <div className="chart-label-name">{ext}</div>
                    <div className="chart-bar-track">
                      <div
                        className="chart-bar-fill"
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
                    <div className="chart-bar-count">{count}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="recent-title">Last 5 Conversions</div>
              <div className="recent-list">
                {lastFive.map((item, i) => (
                  <div className="recent-item" key={i}>
                    <div className="recent-ext">{getExt(item.filename)}</div>
                    <div>
                      <div className="recent-name">{item.filename}</div>
                      <div className="recent-meta">
                        {item.date} · {item.chars.toLocaleString()} chars
                      </div>
                    </div>
                    <button
                      className="history-view-btn"
                      onClick={() => navigate("history")}
                    >
                      View →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {history.length === 0 && (
          <div className="history-empty">
            <div className="history-empty-title">No conversions yet</div>
            <p className="history-empty-sub">
              Convert a file to see your dashboard stats.
            </p>
            <button className="btn-primary" onClick={() => navigate("convert")}>
              Convert a file →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


import { useState } from "react";
import Landing from "./pages/Landing";
import Convert from "./pages/Convert";
import History from "./pages/History";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("landing");
  const [history, setHistory] = useState([]);

  const navigate = (p) => setPage(p);

  const addToHistory = (item) => {
    setHistory((prev) => [item, ...prev].slice(0, 20));
  };

  return (
    <div className="app">
      <Nav page={page} navigate={navigate} />
      {page === "landing" && <Landing navigate={navigate} />}
      {page === "convert" && <Convert navigate={navigate} addToHistory={addToHistory} />}
      {page === "history" && <History navigate={navigate} history={history} />}
    </div>
  );
}

function Nav({ page, navigate }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <button className="nav-logo" onClick={() => navigate("landing")}>
          <span className="logo-mark">M↓</span>
          <span className="logo-text">markitdown</span>
        </button>
        <div className="nav-links">
          <button className={`nav-link ${page === "convert" ? "active" : ""}`} onClick={() => navigate("convert")}>Convert</button>
          <button className={`nav-link ${page === "history" ? "active" : ""}`} onClick={() => navigate("history")}>History</button>
          <button className="nav-cta" onClick={() => navigate("convert")}>Start Converting →</button>
        </div>
      </div>
    </nav>
  );
}
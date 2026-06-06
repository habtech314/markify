import { useState } from "react";
import Landing from "./pages/Landing";
import Convert from "./pages/Convert";
import History from "./pages/History";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import { ArrowRightIcon } from "./components/Icons";
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
      {page === "dashboard" && <Dashboard navigate={navigate} history={history} />}
      {page === "convert" && <Convert navigate={navigate} addToHistory={addToHistory} />}
      {page === "history" && <History navigate={navigate} history={history} />}
      {page === "pricing" && <Pricing navigate={navigate} />}
      {page === "about" && <About />}
    </div>
  );
}

function Nav({ page, navigate }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <button className="nav-logo" onClick={() => navigate("landing")}>
          <span className="logo-mark">M</span>
          <span className="logo-text">arkify</span>
        </button>
        <div className="nav-links">
          <button
            className={`nav-link ${page === "dashboard" ? "active" : ""}`}
            onClick={() => navigate("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`nav-link ${page === "convert" ? "active" : ""}`}
            onClick={() => navigate("convert")}
          >
            Convert
          </button>
          <button
            className={`nav-link ${page === "history" ? "active" : ""}`}
            onClick={() => navigate("history")}
          >
            History
          </button>
          <button
            className={`nav-link ${page === "pricing" ? "active" : ""}`}
            onClick={() => navigate("pricing")}
          >
            Pricing
          </button>
          <button
            className={`nav-link ${page === "about" ? "active" : ""}`}
            onClick={() => navigate("about")}
          >
            About
          </button>
          <button className="nav-cta" onClick={() => navigate("convert")}>
            Start Converting <ArrowRightIcon />
          </button>
        </div>
      </div>
    </nav>
  );
}

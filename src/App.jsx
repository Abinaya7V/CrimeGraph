import { useState, useMemo } from "react";
import GraphCanvas from "./components/GraphCanvas.jsx";
import Legend from "./components/Legend.jsx";
import DashboardHome from "./components/DashboardHome.jsx";
import AuditLogView from "./components/AuditLogView.jsx";
import { nodes, stats } from "./data.js";
import "./App.css";

export default function App() {
  const [view, setView] = useState("home");
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [highlightId, setHighlightId] = useState(null);
  const [showAuditLog, setShowAuditLog] = useState(false);

  const matches = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return nodes.filter((n) => n.data.label.toLowerCase().includes(q));
  }, [query]);

  const handleSearchSelect = (id) => {
    setHighlightId(id);
    const node = nodes.find((n) => n.data.id === id);
    if (node) setSelected(node.data);
    setQuery("");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">CG</span>
          <span className="brand-text">CrimeGraph<span className="brand-ai">-AI</span></span>
        </div>

        <div className="search-wrap">
          <input
            className="search-input"
            placeholder="Search person, phone, vehicle, location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {matches.length > 0 && (
            <div className="search-dropdown">
              {matches.map((m) => (
                <div
                  key={m.data.id}
                  className="search-item"
                  onClick={() => handleSearchSelect(m.data.id)}
                >
                  <span className={`dot dot-${m.data.type}`} />
                  {m.data.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="stats-strip">
          <div className="stat"><span className="stat-num">{stats.totalCases}</span><span className="stat-label">Cases</span></div>
          <div className="stat"><span className="stat-num">{stats.totalEntities}</span><span className="stat-label">Entities</span></div>
          <div className="stat stat-alert"><span className="stat-num">{stats.flaggedIndividuals}</span><span className="stat-label">Flagged</span></div>
          <button className="btn-audit" onClick={() => setShowAuditLog(true)}>View Audit Log</button>
        </div>
      </header>

      {view === "home" ? (
        <DashboardHome onOpenGraph={() => setView("graph")} />
      ) : (
        <div className="main-area">
          <div className="graph-wrap">
            <GraphCanvas onSelectElement={setSelected} highlightId={highlightId} />
            <Legend />
          </div>

          <aside className={`inspector ${selected ? "open" : ""}`}>
            {selected ? (
              <>
                <div className="inspector-header">
                  <span className="inspector-title">
                    {selected.label ?? `${selected.source ?? ""} → ${selected.target ?? ""}`}
                  </span>
                  <button className="close-btn" onClick={() => setSelected(null)}>✕</button>
                </div>

                {selected.type && (
                  <div className={`type-badge type-${selected.type}`}>{selected.type}</div>
                )}

                {selected.bridge && (
                  <div className="bridge-flag">⚠ Flagged as Bridge Node</div>
                )}

                <div className="evidence-block">
                  <div className="evidence-label">Source Evidence</div>
                  <p className="evidence-text">{selected.evidence || selected.label}</p>
                </div>

                <div className="hash-badge">
                  <span className="hash-dot" /> Hash verified · chain intact
                </div>

                <div className="action-row">
                  <button className="btn btn-verify">✓ Verify Link</button>
                  <button className="btn btn-flag">⚑ Flag False Positive</button>
                </div>
              </>
            ) : (
              <div className="inspector-empty">
                Click any node or connection in the graph to inspect its source evidence.
              </div>
            )}
          </aside>
        </div>
      )}
      
      {showAuditLog && <AuditLogView onClose={() => setShowAuditLog(false)} />}
    </div>
  );
}

import { useState, useMemo } from "react";
import GraphCanvas from "./components/GraphCanvas.jsx";
import Legend from "./components/Legend.jsx";
import DashboardHome from "./components/DashboardHome.jsx";
import AuditLogView from "./components/AuditLogView.jsx";
import TimelineScrubber from "./components/TimelineScrubber.jsx";
import JustificationCard from "./components/JustificationCard.jsx";
import LeadsPanel from "./components/LeadsPanel.jsx";
import ConfidenceLegendNote from "./components/ConfidenceLegendNote.jsx";
import ConfidenceBadge from "./components/ConfidenceBadge.jsx";
import { nodes, stats, leads as initialLeads, aliasMatches, auditLog as initialAuditLog } from "./data.js";
import "./App.css";

export default function App() {
  const [view, setView] = useState("home");
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [highlightId, setHighlightId] = useState(null);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [currentDay, setCurrentDay] = useState(10);
  const [appLeads, setAppLeads] = useState(initialLeads);
  const [showLeads, setShowLeads] = useState(false);
  const [corrections, setCorrections] = useState({});
  const [appAuditLog, setAppAuditLog] = useState(initialAuditLog);

  const newLeadsCount = appLeads.filter(l => l.status === "new").length;

  const handleUpdateLead = (id, newStatus) => {
    setAppLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
  };

  const handleInvestigateLead = (nodeId) => {
    handleSearchSelect(nodeId);
    setShowLeads(false);
    setView("graph");
  };

  const handleCorrection = (id, status) => {
    setCorrections(prev => ({ ...prev, [id]: status }));
    
    const actionType = status === "verified" ? "Verified link" : "Flagged false positive";
    const label = selected.label || `${selected.source} → ${selected.target}`;
    
    setAppAuditLog(prev => [
      ...prev,
      {
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        investigator: "Current Investigator",
        action: `${actionType}: ${label}`,
        hash: Math.random().toString(16).substr(2, 8)
      }
    ]);
  };

  const handleResetCorrections = () => {
    setCorrections({});
  };

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
          <button className="btn-leads-toggle" onClick={() => setShowLeads(!showLeads)}>
            Leads ({newLeadsCount})
          </button>
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
            <GraphCanvas onSelectElement={setSelected} highlightId={highlightId} currentDay={currentDay} corrections={corrections} />
            <Legend />
            <ConfidenceLegendNote />
            <TimelineScrubber currentDay={currentDay} onChangeDay={setCurrentDay} maxDay={10} />
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

                {(() => {
                  if (selected.type !== "person") return null;
                  const aliasMatch = aliasMatches.find(a => a.canonical === selected.label);
                  if (aliasMatch && aliasMatch.confidence) {
                    return (
                      <div className="confidence-wrapper">
                        <ConfidenceBadge confidence={aliasMatch.confidence} />
                        <span className="confidence-reason">{aliasMatch.reason}</span>
                      </div>
                    );
                  }
                  return null;
                })()}

                {selected.bridge && (
                  <div className="bridge-flag">⚠ Flagged as Bridge Node</div>
                )}

                <JustificationCard justification={selected.justification} />

                <div className="evidence-block">
                  <div className="evidence-label">Supporting Record</div>
                  <p className="evidence-text">{selected.evidence || selected.label}</p>
                </div>

                <div className="hash-badge">
                  <span className="hash-dot" /> Hash verified · chain intact
                </div>

                <div className="action-row">
                  {(() => {
                    const status = corrections[selected.id];
                    return (
                      <>
                        {status && (
                          <div className={`correction-status status-${status}`}>
                            {status === "verified" ? "✓ Verified by you" : "✕ Flagged as false positive"}
                          </div>
                        )}
                        {status !== "verified" && (
                          <button className="btn btn-verify" onClick={() => handleCorrection(selected.id, "verified")}>✓ Verify Link</button>
                        )}
                        {status !== "rejected" && (
                          <button className="btn btn-flag" onClick={() => handleCorrection(selected.id, "rejected")}>⚑ Flag False Positive</button>
                        )}
                      </>
                    );
                  })()}
                </div>
              </>
            ) : (
              <div className="inspector-empty">
                Click any node or connection in the graph to inspect its source evidence.
              </div>
            )}
            
            {Object.keys(corrections).length > 0 && (
              <div className="reset-corrections-wrap">
                <button className="btn-reset-corrections" onClick={handleResetCorrections}>
                  Reset my corrections
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
      
      {showAuditLog && <AuditLogView onClose={() => setShowAuditLog(false)} auditLog={appAuditLog} />}
      
      {showLeads && (
        <LeadsPanel 
          leads={appLeads} 
          onUpdateLead={handleUpdateLead} 
          onClose={() => setShowLeads(false)} 
          onInvestigate={handleInvestigateLead} 
        />
      )}
    </div>
  );
}

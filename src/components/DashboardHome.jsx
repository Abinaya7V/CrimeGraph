import { stats } from "../data.js";
import AliasMatchesPanel from "./AliasMatchesPanel.jsx";

export default function DashboardHome({ onOpenGraph }) {
  return (
    <div className="dashboard-home">
      <div className="dash-header">
        <h1 className="dash-title">Welcome, Investigator</h1>
        <p className="dash-subtitle">Overview of current CrimeGraph-AI intelligence</p>
      </div>
      
      <div className="stat-cards">
        <div className="stat-card">
          <div className="card-accent accent-blue"></div>
          <div className="card-value">{stats.totalCases}</div>
          <div className="card-label">Total Cases</div>
        </div>
        <div className="stat-card">
          <div className="card-accent accent-green"></div>
          <div className="card-value">{stats.totalEntities}</div>
          <div className="card-label">Total Entities</div>
        </div>
        <div className="stat-card">
          <div className="card-accent accent-red"></div>
          <div className="card-value">{stats.flaggedIndividuals}</div>
          <div className="card-label">Flagged Individuals</div>
        </div>
        <div className="stat-card">
          <div className="card-accent accent-orange"></div>
          <div className="card-value">{stats.activeAlerts}</div>
          <div className="card-label">Active Alerts</div>
        </div>
      </div>

      <div className="dashboard-row">
        <div className="recent-alerts">
          <h2>Recent Alerts</h2>
          <ul className="alerts-list">
            <li className="alert-item">
              <span className="alert-dot red-dot"></span>
              <div className="alert-content">
                <strong>Bridge node flagged:</strong> Suresh M. identified as structural bridge.
              </div>
            </li>
            <li className="alert-item">
              <span className="alert-dot orange-dot"></span>
              <div className="alert-content">
                <strong>Unusual transaction pattern:</strong> Acc XXXX7743 - Rapid multi-account transfer.
              </div>
            </li>
          </ul>
        </div>
        
        <AliasMatchesPanel />
      </div>

      <button className="btn-open-graph" onClick={onOpenGraph}>
        Open Investigation Graph &rarr;
      </button>
    </div>
  );
}

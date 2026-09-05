export default function CrossCaseAlert({ bridgeName, cases, onViewCluster, onDismiss }) {
  if (!bridgeName || cases.length < 2) return null;

  return (
    <div className="cross-case-alert">
      <div className="cross-case-alert-content">
        <span className="cross-case-icon">⚠</span>
        <span className="cross-case-text">
          <strong>Cross-Jurisdiction Link Detected:</strong> {bridgeName} connects Case {cases[0].caseId} ({cases[0].district}) to Case {cases[1].caseId} ({cases[1].district}) — these cases have no prior recorded link.
        </span>
      </div>
      <div className="cross-case-actions">
        <button className="btn-view-cluster" onClick={onViewCluster}>View Case Cluster</button>
        <button className="btn-dismiss-alert" onClick={onDismiss}>✕</button>
      </div>
    </div>
  );
}

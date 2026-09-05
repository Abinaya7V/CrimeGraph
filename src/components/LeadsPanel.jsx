export default function LeadsPanel({ leads, onUpdateLead, onClose, onInvestigate }) {
  return (
    <div className="leads-panel">
      <div className="leads-header">
        <h2 className="leads-title">Investigative Leads</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
      
      <p className="leads-disclaimer">
        The system has flagged the following items for human review. These are algorithmic suggestions, not proven facts. Please review and categorize them.
      </p>

      <div className="leads-list">
        {leads.map(lead => (
          <div key={lead.id} className={`lead-card ${lead.status !== "new" ? "lead-resolved" : ""}`}>
            <div className="lead-card-header">
              <span className="lead-title">{lead.title}</span>
              <span className={`lead-badge lead-badge-${lead.type}`}>
                {lead.type}
              </span>
            </div>
            
            <p className="lead-summary">{lead.summary}</p>
            
            {lead.status === "new" ? (
              <div className="lead-actions">
                <button 
                  className="btn-lead-investigate" 
                  onClick={() => onInvestigate(lead.relatedNodeId)}
                >
                  Investigate
                </button>
                <div className="lead-actions-right">
                  <button 
                    className="btn-lead-action" 
                    onClick={() => onUpdateLead(lead.id, "reviewed")}
                  >
                    Mark Reviewed
                  </button>
                  <button 
                    className="btn-lead-action btn-lead-dismiss" 
                    onClick={() => onUpdateLead(lead.id, "dismissed")}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ) : (
              <div className="lead-status-banner">
                {lead.status === "reviewed" ? "✓ Marked as Reviewed" : "✕ Dismissed"}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

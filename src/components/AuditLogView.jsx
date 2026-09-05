export default function AuditLogView({ onClose, auditLog }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Audit Log</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <table className="audit-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Investigator</th>
                <th>Action</th>
                <th>Hash</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map((log, idx) => (
                <tr key={idx}>
                  <td>{log.time}</td>
                  <td>{log.investigator}</td>
                  <td>{log.action}</td>
                  <td className="hash-col">{log.hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function JustificationCard({ justification }) {
  const handleCopy = () => {
    if (justification) {
      navigator.clipboard.writeText(justification);
    }
  };

  if (!justification) return null;

  return (
    <div className="justification-card">
      <div className="justification-header">
        <span className="justification-label">Why this was flagged</span>
        <button className="btn-copy-notes" onClick={handleCopy}>
          Copy for Case Notes
        </button>
      </div>
      <p className="justification-text">{justification}</p>
    </div>
  );
}

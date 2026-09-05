import { useState } from "react";

export default function ConfidenceLegendNote() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="confidence-legend-note">
      <span className="legend-note-text">
        <strong>Grey ring</strong> = highly connected individual (may be a common contact, not necessarily suspicious). <strong>Red ring</strong> = structural bridge between separate case clusters (stronger investigative signal).
      </span>
      <button className="legend-note-close" onClick={() => setVisible(false)}>✕</button>
    </div>
  );
}

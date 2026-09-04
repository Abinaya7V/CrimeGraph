import { aliasMatches } from "../data.js";
import ConfidenceBadge from "./ConfidenceBadge.jsx";

export default function AliasMatchesPanel() {
  return (
    <div className="alias-panel">
      <h2>Entity Resolution (Aliases)</h2>
      <div className="alias-list">
        {aliasMatches.map((match, idx) => (
          <div key={idx} className="alias-item">
            <div className="alias-header">
              <span className="alias-canonical">{match.canonical}</span>
              <span className="alias-matched">aliases: {match.aliases.join(", ")}</span>
              <ConfidenceBadge confidence={match.confidence} />
            </div>
            <div className="alias-reason">
              {match.reason}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

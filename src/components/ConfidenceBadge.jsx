export default function ConfidenceBadge({ confidence }) {
  let colorClass = "conf-red";
  if (confidence >= 85) colorClass = "conf-green";
  else if (confidence >= 60) colorClass = "conf-amber";

  return (
    <span className={`confidence-badge ${colorClass}`}>
      {confidence}% match
    </span>
  );
}

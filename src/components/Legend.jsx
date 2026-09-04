const items = [
  { label: "Person", color: "#4C6EF5" },
  { label: "Phone", color: "#40C057" },
  { label: "Vehicle", color: "#F59F00" },
  { label: "Location", color: "#E64980" },
  { label: "Account", color: "#7048E8" },
];

export default function Legend() {
  return (
    <div style={{
      position: "absolute", top: 16, right: 16, background: "white",
      border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)", fontSize: 12, zIndex: 5,
    }}>
      {items.map((it) => (
        <div key={it.label} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
          <span style={{
            width: 12, height: 12, borderRadius: "50%", background: it.color,
            display: "inline-block", marginRight: 8,
          }} />
          {it.label}
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{
          width: 12, height: 12, borderRadius: "50%", background: "white",
          border: "3px solid #E03131", display: "inline-block", marginRight: 8,
        }} />
        Bridge Node (flagged)
      </div>
    </div>
  );
}

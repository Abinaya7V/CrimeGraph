// Synthetic, privacy-safe demo dataset for CrimeGraph-AI
// Models the "Tracing a Trafficking Network Across States" scenario

export const nodes = [
  // Persons
  { data: { id: "p_ravi", label: "Ravi Kumar", type: "person", aliasOf: null,
    confidence: null, bridge: false,
    evidence: "Case A (Chennai FIR #2291): Named as suspect who contacted victim's family." } },
  { data: { id: "p_suresh", label: "Suresh M.", type: "person", aliasOf: null,
    confidence: null, bridge: true,
    evidence: "Case B (Mumbai CDR log): Frequent contact with two separate phone clusters. Flagged as a structural bridge connecting the Tamil Nadu/Maharashtra group to a separate Kerala-based cluster." } },
  { data: { id: "p_anita", label: "Anita R.", type: "person", aliasOf: null,
    confidence: null, bridge: false,
    evidence: "Case C (Bengaluru transaction record): Linked to Account XXXX7743." } },
  { data: { id: "p_deepak", label: "Deepak S.", type: "person", aliasOf: null,
    confidence: null, bridge: false,
    evidence: "Case D (Kerala FIR #1187): Named contact for Phone_96xxx341." } },
  { data: { id: "p_unknown", label: "Unknown_X", type: "person", aliasOf: null,
    confidence: null, bridge: false,
    evidence: "Identity unconfirmed. Appears in Mumbai Node surveillance log, linked to Suresh M. cluster." } },

  // Phones
  { data: { id: "ph_1", label: "Ph: 98xxx122", type: "phone", aliasOf: null,
    confidence: null, bridge: false,
    evidence: "Case A CDR: Registered contact of Ravi Kumar, called victim's family twice on 14 Mar." } },
  { data: { id: "ph_2", label: "Ph: 97xxx899", type: "phone", aliasOf: null,
    confidence: null, bridge: false,
    evidence: "Case B CDR (Mumbai cybercrime unit): 14 calls exchanged with Ph:98xxx122 over 3 weeks." } },
  { data: { id: "ph_3", label: "Ph: 96xxx341", type: "phone", aliasOf: null,
    confidence: null, bridge: false,
    evidence: "Case D CDR (Kerala): Registered to Suresh M., in contact with Deepak S." } },

  // Vehicle
  { data: { id: "v_1", label: "Veh: TN-09-AB-4521", type: "vehicle", aliasOf: null,
    confidence: null, bridge: false,
    evidence: "Surveillance report (Case C): Vehicle seen near Transit Point on 3 occasions in April." } },

  // Locations
  { data: { id: "l_chennai", label: "Chennai Hub", type: "location", aliasOf: null,
    confidence: null, bridge: false,
    evidence: "Case A FIR filing location." } },
  { data: { id: "l_transit", label: "Transit Point", type: "location", aliasOf: null,
    confidence: null, bridge: false,
    evidence: "Surveillance report: known trafficking transit point, Tamil Nadu-Karnataka border." } },
  { data: { id: "l_mumbai", label: "Mumbai Node", type: "location", aliasOf: null,
    confidence: null, bridge: false,
    evidence: "Case B: location tagged in CDR tower-triangulation data." } },

  // Account
  { data: { id: "a_1", label: "Acc: XXXX7743", type: "account", aliasOf: null,
    confidence: null, bridge: false,
    evidence: "Case C transaction record: Rapid multi-account transfer flagged by anomaly detection (Isolation Forest, 48hr window)." } },
];

export const edges = [
  { data: { source: "p_ravi", target: "ph_1", label: "called", timestamp: 1,
    evidence: "Case A FIR #2291, para 3: phone log extract." } },
  { data: { source: "p_ravi", target: "l_chennai", label: "based in", timestamp: 1,
    evidence: "FIR filing address, Case A." } },
  { data: { source: "ph_1", target: "ph_2", label: "called", timestamp: 2,
    evidence: "Case B CDR row #4471: 14 calls, 12-24 Mar." } },
  { data: { source: "ph_2", target: "p_suresh", label: "registered to", timestamp: 3,
    evidence: "Telecom subscriber record, Case B." } },
  { data: { source: "p_suresh", target: "l_mumbai", label: "located in", timestamp: 4,
    evidence: "CDR tower triangulation, Case B." } },
  { data: { source: "p_ravi", target: "a_1", label: "linked to", timestamp: 5,
    evidence: "Bank KYC cross-reference, Case C." } },
  { data: { source: "a_1", target: "p_anita", label: "transferred to", timestamp: 6,
    evidence: "Transaction record, Case C, Acc XXXX7743 -> Anita R." } },
  { data: { source: "p_ravi", target: "v_1", label: "uses", timestamp: 7,
    evidence: "Surveillance report, Case C: vehicle association." } },
  { data: { source: "v_1", target: "l_transit", label: "seen near", timestamp: 8,
    evidence: "Surveillance log entries, 3 occurrences, April." } },
  { data: { source: "p_suresh", target: "ph_3", label: "called", timestamp: 9,
    evidence: "Case D CDR (Kerala unit), cross-referenced by phone number match." } },
  { data: { source: "ph_3", target: "p_deepak", label: "registered to", timestamp: 9,
    evidence: "Telecom subscriber record, Case D." } },
  { data: { source: "p_deepak", target: "p_unknown", label: "associated with", timestamp: 10,
    evidence: "Surveillance report, Case D, joint appearance at Mumbai Node location." } },
  { data: { source: "p_unknown", target: "l_mumbai", label: "seen at", timestamp: 10,
    evidence: "Surveillance log, unconfirmed identity." } },
];

// Entity resolution example: aliases that were merged into canonical entities
export const aliasMatches = [
  { canonical: "Ravi Kumar", aliases: ["R. Kumar", "Ravi K."], confidence: 87,
    reason: "Shared phone number (Ph:98xxx122) across Case A and B; name similarity (Jaro-Winkler)." },
  { canonical: "Suresh M.", aliases: ["Suresh Menon"], confidence: 74,
    reason: "Partial name match + shared location tag (Mumbai Node)." },
];

export const stats = {
  totalCases: 4,
  totalEntities: nodes.length,
  flaggedIndividuals: 1,
  activeAlerts: 2,
};

export const auditLog = [
  { time: "10:02:14", investigator: "Insp. R. Sharma", action: "Searched: Ravi Kumar", hash: "8f4a...c21e" },
  { time: "10:04:47", investigator: "Insp. R. Sharma", action: "Viewed evidence: Case A FIR #2291", hash: "3b9d...77f0" },
  { time: "10:15:02", investigator: "Insp. P. Nair", action: "Flagged bridge node: Suresh M.", hash: "e12c...4a8b" },
  { time: "10:16:31", investigator: "Insp. P. Nair", action: "Exported report: Case A-D cluster", hash: "90aa...1d3f" },
];

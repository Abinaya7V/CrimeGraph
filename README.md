\# CrimeGraph-AI



An explainable, Indian-context-aware criminal network analysis platform built for SIH 2026 (PS 26189 — AI-Powered Criminal Network Analysis System, Ministry of Home Affairs / NCRB, Women Safety Division).



\## What it does

CrimeGraph-AI converts fragmented crime data (FIRs, CDRs, financial records, surveillance reports) into a connected, explainable relationship graph. It identifies key individuals, bridge connections between separate case clusters, and surfaces every insight with a direct link back to its source evidence — no black-box scoring.



\## Tech Stack

\- Frontend: React, Vite, Cytoscape.js

\- Planned backend: Python, FastAPI, Neo4j/NetworkX, spaCy/MuRIL

\- Security: SHA-256 hash-chained audit logging (planned)



\## Current Status

This is a hackathon prototype built on synthetic, privacy-safe data. Core UI modules implemented so far:

\- Interactive network graph with entity color-coding and bridge-node detection

\- Evidence Inspector — every node/edge links to its source record

\- Search and highlight across the network



\## Known Limitations

\- Uses synthetic data only; real FIR/CDR/financial data is legally restricted and not used here

\- No production-grade backend yet — data is currently hardcoded for demo purposes

\- Role-based access control and bulk entity-resolution correction are not yet implemented

\- Not integrated with CCTNS/ICJS — designed conceptually as a future overlay, not a live integration



\## Running Locally

\\`\\`\\`bash

npm install

npm run dev

\\`\\`\\`



\## Team

Built by Abinaya, Department of Computer Technology, Kongu Engineering College.


import { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import { nodes, edges } from "../data.js";

const TYPE_COLORS = {
  person: "#4C6EF5",
  phone: "#40C057",
  vehicle: "#F59F00",
  location: "#E64980",
  account: "#7048E8",
};

export default function GraphCanvas({ onSelectElement, highlightId, highlightCluster, currentDay = 10, corrections = {} }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const [bridgeTooltip, setBridgeTooltip] = useState(null);

  useEffect(() => {
    const cy = cytoscape({
      container: containerRef.current,
      elements: [...nodes, ...edges],
      style: [
        {
          selector: "node",
          style: {
            "background-color": (ele) => TYPE_COLORS[ele.data("type")] || "#999",
            label: "data(label)",
            color: "#1A202C",
            "font-size": 11,
            "font-weight": 600,
            "text-valign": "bottom",
            "text-margin-y": 6,
            width: 42,
            height: 42,
            "border-width": 2,
            "border-color": "#ffffff",
          },
        },
        {
          selector: "node[?bridge]",
          style: {
            "border-width": 4,
            "border-color": "#E03131",
            width: 54,
            height: 54,
          },
        },
        {
          selector: "node[connectionCount >= 3][!bridge]",
          style: {
            "border-width": 4,
            "border-color": "#ced4da",
            width: 48,
            height: 48,
          },
        },
        {
          selector: "edge",
          style: {
            width: 2,
            "line-color": "#adb5bd",
            "target-arrow-color": "#adb5bd",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            label: "data(label)",
            "font-size": 8,
            color: "#666",
            "text-rotation": "autorotate",
          },
        },
        {
          selector: ".faded",
          style: { opacity: 0.15 },
        },
        {
          selector: "node.corrected-verified",
          style: {
            "border-color": "#276749",
            "border-width": 4,
            label: (ele) => ele.data("label") + " ✓",
          }
        },
        {
          selector: "node.corrected-rejected",
          style: {
            "border-style": "dashed",
            "border-width": 3,
            "border-color": "#c53030",
            opacity: 0.4,
            label: (ele) => ele.data("label") + " ✕",
          }
        },
        {
          selector: "edge.corrected-rejected",
          style: {
            "line-style": "dashed",
            "line-color": "#c53030",
            "target-arrow-color": "#c53030",
            opacity: 0.4,
            label: (ele) => ele.data("label") + " ✕",
          }
        },
        {
          selector: "edge.corrected-verified",
          style: {
            "line-color": "#276749",
            "target-arrow-color": "#276749",
            label: (ele) => ele.data("label") + " ✓",
          }
        },
        {
          selector: ".highlighted",
          style: {
            "border-color": "#1971C2",
            "border-width": 5,
            "line-color": "#1971C2",
            "target-arrow-color": "#1971C2",
            opacity: 1,
          },
        },
      ],
      layout: { name: "cose", animate: false, padding: 40 },
      wheelSensitivity: 0.25,
    });

    cy.on("tap", "node, edge", (evt) => {
      const ele = evt.target;
      onSelectElement(ele.data());
    });

    cy.on("tap", (evt) => {
      if (evt.target === cy) onSelectElement(null);
    });

    cy.on("mouseover", "node[?bridge]", (evt) => {
      const node = evt.target;
      const pos = node.renderedPosition();
      setBridgeTooltip({
        text: "Bridges Cluster-TN ↔ Cluster-KL",
        x: pos.x,
        y: pos.y
      });
    });

    cy.on("mouseout", "node[?bridge]", () => {
      setBridgeTooltip(null);
    });

    cyRef.current = cy;
    return () => cy.destroy();
  }, [onSelectElement]);

  // Handle search highlight and temporal filter
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    
    cy.elements().removeClass("faded highlighted");

    // Apply temporal filter
    let visibleEles = cy.elements();
    if (currentDay < 10) {
      const visibleEdges = cy.edges().filter(e => {
        const t = e.data('timestamp');
        return t != null && t <= currentDay;
      });
      visibleEles = visibleEdges.union(visibleEdges.connectedNodes());
      cy.elements().difference(visibleEles).addClass("faded");
    }

    // Apply highlightCluster OR highlightId
    if (highlightCluster && highlightCluster.length > 0) {
      const clusterEles = visibleEles.filter(e => {
        if (e.isNode()) return highlightCluster.includes(e.data('caseId')) || e.data('bridge') === true;
        if (e.isEdge()) {
          const sCase = e.source().data('caseId');
          const tCase = e.target().data('caseId');
          const sBridge = e.source().data('bridge');
          const tBridge = e.target().data('bridge');
          return (highlightCluster.includes(sCase) || sBridge) && (highlightCluster.includes(tCase) || tBridge);
        }
        return false;
      });
      cy.elements().addClass("faded");
      clusterEles.removeClass("faded");
    } else if (highlightId) {
      const target = cy.getElementById(highlightId);
      if (target && target.length) {
        cy.elements().addClass("faded");
        target.removeClass("faded").addClass("highlighted");
        target.connectedEdges().removeClass("faded").addClass("highlighted");
        target.neighborhood("node").removeClass("faded");
        cy.animate({ center: { eles: target }, zoom: 1.4 }, { duration: 400 });
      }
    }
  }, [highlightId, highlightCluster, currentDay]);

  // Handle corrections styling
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.elements().removeClass("corrected-verified corrected-rejected");

    Object.entries(corrections).forEach(([id, status]) => {
      const ele = cy.getElementById(id);
      if (ele && ele.length) {
        if (status === "verified") {
          ele.addClass("corrected-verified");
        } else if (status === "rejected") {
          ele.addClass("corrected-rejected");
        }
      }
    });
  }, [corrections]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      {bridgeTooltip && (
        <div style={{
          position: "absolute",
          top: bridgeTooltip.y - 40,
          left: bridgeTooltip.x,
          transform: "translateX(-50%)",
          background: "#1a365d",
          color: "white",
          padding: "6px 10px",
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: 600,
          pointerEvents: "none",
          whiteSpace: "nowrap",
          zIndex: 100,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }}>
          {bridgeTooltip.text}
          <div style={{
            position: "absolute",
            bottom: "-4px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "5px solid #1a365d"
          }} />
        </div>
      )}
    </div>
  );
}

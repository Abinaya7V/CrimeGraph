import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import { nodes, edges } from "../data.js";

const TYPE_COLORS = {
  person: "#4C6EF5",
  phone: "#40C057",
  vehicle: "#F59F00",
  location: "#E64980",
  account: "#7048E8",
};

export default function GraphCanvas({ onSelectElement, highlightId }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

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

    cyRef.current = cy;
    return () => cy.destroy();
  }, [onSelectElement]);

  // Handle search highlight
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.elements().removeClass("faded highlighted");
    if (highlightId) {
      const target = cy.getElementById(highlightId);
      if (target && target.length) {
        cy.elements().addClass("faded");
        target.removeClass("faded").addClass("highlighted");
        target.connectedEdges().removeClass("faded").addClass("highlighted");
        target.neighborhood("node").removeClass("faded");
        cy.animate({ center: { eles: target }, zoom: 1.4 }, { duration: 400 });
      }
    }
  }, [highlightId]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}

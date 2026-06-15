import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";

/**
 * Scandinavian Light Portfolio Template
 * Category: Minimal / Clean
 * Description: Scandinavian design with warm whites, soft shadows,
 * wood-grain texture accents, rounded friendly shapes.
 * Cozy, hygge-inspired minimal feel.
 */
export default function ScandinavianLight() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f6f2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          width: "100%",
          background: "#ffffff",
          borderRadius: "24px",
          padding: "3rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            marginBottom: "0.5rem",
            color: "#222",
          }}
        >
          {data?.personal?.name || "Your Name"}
        </h1>

        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "400",
            color: "#666",
            marginBottom: "2rem",
          }}
        >
          {data?.personal?.title || "Your Title"}
        </h2>

        <div
          style={{
            display: "inline-block",
            padding: "0.5rem 1rem",
            borderRadius: "999px",
            background: "#f0ece5",
            color: "#7a6a58",
            marginBottom: "1.5rem",
          }}
        >
          Minimal / Clean
        </div>

        <h3
          style={{
            fontSize: "1.75rem",
            color: "#333",
            marginBottom: "1rem",
          }}
        >
          Scandinavian Light Template
        </h3>

        <p
          style={{
            color: "#555",
            lineHeight: 1.7,
            marginBottom: "2rem",
          }}
        >
          Scandinavian design with warm whites, soft shadows, wood-grain
          texture accents, rounded friendly shapes. Cozy, hygge-inspired
          minimal feel.
        </p>

        <p
          style={{
            color: "#888",
            fontSize: "0.95rem",
          }}
        >
          Open an issue to contribute and build this template!
        </p>
      </div>
    </div>
  );
}
import React, { useState } from "react";

const PRESET_PALETTES = [
  {
    name: "Ocean",
    primary: "#0ea5e9",
    secondary: "#38bdf8",
    background: "#f0f9ff",
    text: "#0c4a6e",
  },
  {
    name: "Forest",
    primary: "#16a34a",
    secondary: "#4ade80",
    background: "#f0fdf4",
    text: "#14532d",
  },
  {
    name: "Sunset",
    primary: "#ea580c",
    secondary: "#fb923c",
    background: "#fff7ed",
    text: "#431407",
  },
  {
    name: "Lavender",
    primary: "#7c3aed",
    secondary: "#a78bfa",
    background: "#f5f3ff",
    text: "#2e1065",
  },
  {
    name: "Charcoal",
    primary: "#334155",
    secondary: "#64748b",
    background: "#f8fafc",
    text: "#0f172a",
  },
  {
    name: "Rose",
    primary: "#e11d48",
    secondary: "#fb7185",
    background: "#fff1f2",
    text: "#4c0519",
  },
];

const ColorCustomizer = ({ portfolioColors = {}, onColorsChange }) => {
  const [colors, setColors] = useState({
    primary: portfolioColors.primary || "#0ea5e9",
    secondary: portfolioColors.secondary || "#38bdf8",
    background: portfolioColors.background || "#f0f9ff",
    text: portfolioColors.text || "#0c4a6e",
  });

  const [activePreset, setActivePreset] = useState(null);

  const handleColorChange = (key, value) => {
    const updated = { ...colors, [key]: value };
    setColors(updated);
    setActivePreset(null);
    if (onColorsChange) onColorsChange(updated);
  };

  const applyPreset = (palette) => {
    const updated = {
      primary: palette.primary,
      secondary: palette.secondary,
      background: palette.background,
      text: palette.text,
    };
    setColors(updated);
    setActivePreset(palette.name);
    if (onColorsChange) onColorsChange(updated);
  };

  const colorFields = [
    { key: "primary", label: "Primary" },
    { key: "secondary", label: "Secondary / Accent" },
    { key: "background", label: "Background" },
    { key: "text", label: "Text" },
  ];

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif", maxWidth: "360px" }}>

      <p style={{ fontSize: "13px", fontWeight: 500, marginBottom: "12px" }}>
        Preset Palettes
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
        {PRESET_PALETTES.map((palette) => (
          <button type="button"
            key={palette.name}
            onClick={() => applyPreset(palette)}
            title={palette.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 10px",
              borderRadius: "8px",
              border: activePreset === palette.name
                ? "2px solid #334155"
                : "1px solid #e2e8f0",
              background: "#fff",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: activePreset === palette.name ? 600 : 400,
            }}
          >
            <span style={{
              display: "flex",
              gap: "2px",
            }}>
              {[palette.primary, palette.secondary, palette.background].map((c, i) => (
                <span key={i} style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: c,
                  border: "1px solid #e2e8f0",
                  display: "inline-block",
                }} />
              ))}
            </span>
            {palette.name}
          </button>
        ))}
      </div>

      <p style={{ fontSize: "13px", fontWeight: 500, marginBottom: "12px" }}>
        Custom Colors
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {colorFields.map(({ key, label }) => (
          <div key={key} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            background: "#fafafa",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                background: colors[key],
                border: "1px solid #e2e8f0",
                display: "inline-block",
              }} />
              <span style={{ fontSize: "13px", color: "#334155" }}>{label}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "#94a3b8", fontFamily: "monospace" }}>
                {colors[key]}
              </span>
              <input
                type="color"
                value={colors[key]}
                onChange={(e) => handleColorChange(key, e.target.value)}
                style={{
                  width: "32px",
                  height: "32px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  padding: 0,
                  background: "none",
                }}
                aria-label={`Pick ${label} color`}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: "20px",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        background: colors.background,
      }}>
        <p style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "8px" }}>
          Preview
        </p>
        <div style={{
          padding: "12px",
          borderRadius: "6px",
          background: colors.background,
          border: `2px solid ${colors.primary}`,
        }}>
          <p style={{ color: colors.primary, fontWeight: 600, fontSize: "14px", margin: "0 0 4px" }}>
            Portfolio Title
          </p>
          <p style={{ color: colors.text, fontSize: "12px", margin: "0 0 8px" }}>
            This is a preview of your selected color scheme.
          </p>
          <span style={{
            background: colors.primary,
            color: "#fff",
            fontSize: "11px",
            padding: "4px 10px",
            borderRadius: "4px",
            display: "inline-block",
          }}>
            Primary Button
          </span>
          <span style={{
            background: colors.secondary,
            color: "#fff",
            fontSize: "11px",
            padding: "4px 10px",
            borderRadius: "4px",
            display: "inline-block",
            marginLeft: "6px",
          }}>
            Secondary
          </span>
        </div>
      </div>

    </div>
  );
};

export default ColorCustomizer;
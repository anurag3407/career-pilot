import { useState } from "react";

export default function PreviewFrame({ url, device, setDevice }) {

  const getWidth = () => {
    if (device === "tablet") return "768px";
    if (device === "mobile") return "375px";
    return "100%";
  };

  return (
    <div className="w-full mt-6">

      {/* Device Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setDevice("desktop")}
          className={device === "desktop" ? "font-bold" : ""}
        >
          💻 Desktop
        </button>

        <button
          onClick={() => setDevice("tablet")}
          className={device === "tablet" ? "font-bold" : ""}
        >
          📱 Tablet
        </button>

        <button
          onClick={() => setDevice("mobile")}
          className={device === "mobile" ? "font-bold" : ""}
        >
          📱 Mobile
        </button>
      </div>

      {/* Preview */}
      <div className="flex justify-center bg-gray-100 p-4">
        <div
          style={{
            width: getWidth(),
            border: "2px solid #ccc",
            transition: "width 0.3s ease",
          }}
        >
         <div
  style={{
    width: device === "mobile" ? "375px" :
           device === "tablet" ? "768px" : "100%",
    height: "500px",
    background:
      selectedTheme === "minimal"
        ? "#ffffff"
        : selectedTheme === "bold"
        ? "#f97316"
        : "#111",
    color: selectedTheme === "minimal" ? "#000" : "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease"
  }}
>
  Theme: {selectedTheme} <br />
  Device: {device}
</div>
        </div>
      </div>

    </div>
  );
}
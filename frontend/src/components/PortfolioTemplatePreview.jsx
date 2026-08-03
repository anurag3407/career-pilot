import { useState } from "react";
import { Eye, RotateCcw, Palette, Type } from "lucide-react";

export default function PortfolioTemplatePreview() {
  const defaultSettings = {
    color: "#2563eb",
    fontSize: "16px",
    layout: "Modern",
  };

  const [settings, setSettings] = useState(defaultSettings);

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Eye className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-black">
          Portfolio Template Preview
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Controls */}
        <div className="space-y-4">

          <div>
            <label className="font-bold flex gap-2 items-center mb-2">
              <Palette size={18} />
              Theme Color
            </label>

            <input
              type="color"
              value={settings.color}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  color: e.target.value,
                })
              }
            />
          </div>


          <div>
            <label className="font-bold flex gap-2 items-center mb-2">
              <Type size={18} />
              Typography
            </label>

            <select
              className="border rounded-lg p-2 w-full"
              value={settings.fontSize}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  fontSize: e.target.value,
                })
              }
            >
              <option value="14px">Small</option>
              <option value="16px">Medium</option>
              <option value="20px">Large</option>
            </select>
          </div>


          <button
            onClick={resetSettings}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg"
          >
            <RotateCcw size={18}/>
            Reset Default
          </button>

        </div>


        {/* Live Preview */}
        <div className="border rounded-xl p-5">
          <h3
            className="font-black"
            style={{
              color: settings.color,
              fontSize: settings.fontSize,
            }}
          >
            Jane Developer
          </h3>

          <p
            style={{
              fontSize: settings.fontSize,
            }}
          >
            Full Stack Developer | React | Node.js
          </p>

          <div className="mt-4">
            <h4 className="font-bold">
              Projects
            </h4>

            <ul className="list-disc ml-5">
              <li>E-commerce Platform</li>
              <li>AI Resume Analyzer</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
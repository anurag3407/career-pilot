/**
 * Layout-invisible scope that restores Tailwind's stock palette for its
 * subtree (see the "Legacy palette remap" section in styles/flightdeck.css).
 * Portfolio templates ship their own designed look, so every surface that
 * renders a template (preview pages, stage iframe, gallery cards, standalone
 * exports) is wrapped in this to keep the remapped workspace hues out.
 */
export default function RawPalette({ children }) {
  return <div className="cp-raw-palette">{children}</div>;
}

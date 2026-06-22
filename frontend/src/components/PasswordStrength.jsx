/**
 * PasswordStrength — live password strength indicator for Register page.
 * Shows a segmented bar + label: Very Weak / Weak / Fair / Strong / Very Strong
 */
export default function PasswordStrength({ password }) {
  if (!password) return null;

  const getStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    return score;
  };

  const score = getStrength(password);

  const levels = [
    { label: "Very Weak", color: "#dc2626", segments: 1 },
    { label: "Weak",      color: "#ef4444", segments: 1 },
    { label: "Fair",      color: "#f97316", segments: 2 },
    { label: "Strong",    color: "#22c55e", segments: 3 },
    { label: "Very Strong", color: "#06b6d4", segments: 4 },
  ];

  const current = levels[Math.min(score, 4)];

  const tips = [];
  if (password.length < 8) tips.push("8+ characters");
  if (!/[a-z]/.test(password)) tips.push("lowercase letter");
  if (!/[A-Z]/.test(password)) tips.push("uppercase letter");
  if (!/[0-9]/.test(password)) tips.push("number");

  return (
    <div style={{ marginTop: "-8px", marginBottom: "16px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
        {[1, 2, 3, 4].map((seg) => (
          <div
            key={seg}
            style={{
              flex: 1,
              height: "4px",
              borderRadius: "100px",
              background: seg <= current.segments ? current.color : "rgba(0,0,0,0.1)",
              transition: "background 0.3s ease",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          fontSize: "11px",
          fontWeight: "700",
          color: current.color,
          letterSpacing: "0.03em",
          transition: "color 0.3s ease",
        }}>
          {current.label}
        </span>
        {tips.length > 0 && (
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>
            Add: {tips.slice(0, 2).join(", ")}
          </span>
        )}
      </div>
    </div>
  );
}
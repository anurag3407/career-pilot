import React from "react";

const applications = [
  {
    company: "Google",
    role: "Frontend Developer",
    status: "Applied",
  },
  {
    company: "Microsoft",
    role: "Backend Intern",
    status: "Interview",
  },
  {
    company: "Amazon",
    role: "Full Stack Engineer",
    status: "Rejected",
  },
  {
    company: "Meta",
    role: "React Developer",
    status: "Offer",
  },
];

const cardStyle = {
  background: "#1e1e2f",
  color: "white",
  padding: "20px",
  borderRadius: "12px",
  minWidth: "200px",
  flex: "1",
  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
};

export default function JobTrackerDashboard() {
  return (
    <div
      style={{
        padding: "20px",
        background: "#0f172a",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1 style={{ marginBottom: "10px" }}>
        Job Application Tracker
      </h1>

      <p
        style={{
          color: "#cbd5e1",
          marginBottom: "25px",
        }}
      >
        Track your job applications, interviews, offers, and hiring progress.
      </p>

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Applications</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>12</p>
        </div>

        <div style={cardStyle}>
          <h3>Interviews</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>4</p>
        </div>

        <div style={cardStyle}>
          <h3>Offers</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>1</p>
        </div>

        <div style={cardStyle}>
          <h3>Rejected</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>2</p>
        </div>
      </div>

      <div
        style={{
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#111827",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr>
              <th style={tableHeader}>Company</th>
              <th style={tableHeader}>Role</th>
              <th style={tableHeader}>Status</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((app, index) => (
              <tr key={index}>
                <td style={tableCell}>{app.company}</td>

                <td style={tableCell}>{app.role}</td>

                <td style={tableCell}>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontWeight: "bold",
                      color:
                        app.status === "Applied"
                          ? "#3B82F6"
                          : app.status === "Interview"
                          ? "#F59E0B"
                          : app.status === "Offer"
                          ? "#10B981"
                          : "#EF4444",
                    }}
                  >
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const tableHeader = {
  border: "1px solid #374151",
  padding: "14px",
  background: "#1f2937",
  color: "white",
  textAlign: "left",
};

const tableCell = {
  border: "1px solid #374151",
  padding: "14px",
  color: "white",
};
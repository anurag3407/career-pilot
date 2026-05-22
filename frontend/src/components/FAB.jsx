import { useState, useEffect } from "react";

export default function FAB({ scrollContainerRef }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastScroll = 0;

    const container = scrollContainerRef?.current;

    const handleScroll = () => {
      if (!container) return;

      const currentScroll = container.scrollTop;

      if (currentScroll > lastScroll && currentScroll > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      lastScroll = currentScroll;
    };

    container?.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainerRef]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
      }}
    >
      {open && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <button>Create Portfolio</button>
          <button>Upload Resume</button>
          <button>Search Jobs</button>
          <button>Start Interview</button>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          background: "red",
          color: "white",
          fontSize: "30px",
          cursor: "pointer",
        }}
      >
        {open ? "×" : "+"}
      </button>
    </div>
  );
}
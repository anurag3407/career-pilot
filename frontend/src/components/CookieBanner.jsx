import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");

    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 px-6 py-4 shadow-2xl backdrop-blur-md">
      {" "}
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          We use cookies to improve your experience, enhance site functionality,
          and ensure better performance across the platform.{" "}
          <Link
            to="/cookies"
            className="font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-primary/80"
          >
            Learn more
          </Link>
        </p>

        <div className="flex items-center gap-3">
          <Link
            to="/cookies"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
          >
            Manage Preferences
          </Link>

          <button
            onClick={acceptCookies}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md transition-all duration-200 hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}

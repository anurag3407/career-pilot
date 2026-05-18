import confetti from "canvas-confetti";

export const launchConfetti = ({
  particleCount = 120,
  spread = 70,
  duration = 2000,
}) => {
  const end = Date.now() + duration;

  const interval = setInterval(() => {
    confetti({
      particleCount,
      spread,
      origin: { y: 0.6 },
    });

    if (Date.now() > end) {
      clearInterval(interval);
    }
  }, 250);
};
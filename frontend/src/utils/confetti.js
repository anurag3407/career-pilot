import confetti from "canvas-confetti";

export const triggerConfetti = ({
  duration = 3000,
  particleCount = 150,
  spread = 120
} = {}) => {
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: Math.floor(particleCount / 10),
      spread,
      origin: { y: 0.6 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};
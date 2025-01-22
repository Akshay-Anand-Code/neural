import { useEffect, useRef } from 'react';

const CONSPIRACY_SYMBOLS = [
  '👁', '∆', 'Ω', '☠', '⚠',
  '∞', '⌘', '☤', '⚡', '⚛',
  '🔍', '🗝', '💊', '🕸', '📡',
  ...Array.from('XFILES'),
  ...Array.from('TRUTH'),
  ...Array.from('WAKE'),
  ...Array.from('ALIEN'),
  ...Array.from('MATRIX')
];

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create multiple streams with different properties
    const streams = Array.from({ length: 3 }, (_, i) => ({
      fontSize: 14 - i * 2, // Different sizes for each layer
      columns: Math.ceil(canvas.width / (14 - i * 2)),
      drops: [] as number[],
      colors: [] as string[],
      speeds: [] as number[],
      symbols: [] as string[],
      opacity: 0.8 - i * 0.2 // Different opacity for each layer
    }));

    // Initialize streams
    streams.forEach(stream => {
      for (let x = 0; x < stream.columns; x++) {
        stream.drops[x] = Math.random() * -100; // Start above canvas
        stream.colors[x] = `hsla(${Math.random() * 60 + 140}, 100%, 50%, ${stream.opacity})`;
        stream.speeds[x] = Math.random() * 0.5 + 0.5;
        stream.symbols[x] = CONSPIRACY_SYMBOLS[Math.floor(Math.random() * CONSPIRACY_SYMBOLS.length)];
      }
    });

    function draw() {
      // Create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw each stream
      streams.forEach(stream => {
        ctx.font = `${stream.fontSize}px monospace`;

        for (let i = 0; i < stream.drops.length; i++) {
          // Randomly change symbol
          if (Math.random() < 0.02) {
            stream.symbols[i] = CONSPIRACY_SYMBOLS[Math.floor(Math.random() * CONSPIRACY_SYMBOLS.length)];
          }

          // Randomly change color
          if (Math.random() < 0.001) {
            stream.colors[i] = `hsla(${Math.random() * 60 + 140}, 100%, 50%, ${stream.opacity})`;
          }

          const x = i * stream.fontSize;
          const y = stream.drops[i] * stream.fontSize;

          // Add glow effect
          ctx.shadowBlur = 5;
          ctx.shadowColor = stream.colors[i];
          ctx.fillStyle = stream.colors[i];

          // Draw the symbol
          ctx.fillText(stream.symbols[i], x, y);

          // Reset shadow for next iteration
          ctx.shadowBlur = 0;

          // Reset drops that go below screen with random delay
          if (y > canvas.height) {
            if (Math.random() > 0.99) {
              stream.drops[i] = 0;
              stream.speeds[i] = Math.random() * 0.5 + 0.5;
            }
          }

          // Update drop position
          stream.drops[i] += stream.speeds[i];
        }
      });
    }

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-[0.15] mix-blend-screen"
    />
  );
}
import React, { useRef, useEffect } from "react";
import "../styles/AnalogClockContainer.css";

// Time blocks with updated colors
const timeBlocks = [
  { name: "₡28.30 por kWh", color: "green", start: "20:01", end: "06:00" },
  { name: "₡67.65 por kWh", color: "orange", start: "06:01", end: "10:00" },
  { name: "₡165.01 por kWh", color: "red", start: "10:01", end: "12:30" },
  { name: "₡67.65 por kWh", color: "orange", start: "12:31", end: "17:30" },
  { name: "₡165.01 por kWh", color: "red", start: "17:31", end: "20:00" },
];

// Utility function to darken a color
function darkenBlockColor(color: string, amount = 0.3): string {
  const colorMap: { [key: string]: string } = {
    green: `rgb(0, 128, 0)`,
    orange: `rgb(255, 165, 0)`,
    red: `rgb(255, 0, 0)`,
  };
  const [r, g, b] = colorMap[color]
    .replace(/[^\d,]/g, "")
    .split(",")
    .map(Number);

  return `rgb(${Math.max(0, r - r * amount)}, ${Math.max(
    0,
    g - g * amount
  )}, ${Math.max(0, b - b * amount)})`;
}

// Function to determine the current block
function getCurrentBlock(now: Date) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const block of timeBlocks) {
    const [startHours, startMinutes] = block.start.split(":").map(Number);
    const [endHours, endMinutes] = block.end.split(":").map(Number);

    const start = startHours * 60 + startMinutes;
    const end = endHours * 60 + endMinutes;

    if (start <= end) {
      if (currentMinutes >= start && currentMinutes <= end) {
        return block;
      }
    } else {
      if (currentMinutes >= start || currentMinutes <= end) {
        return block;
      }
    }
  }

  return null;
}

const AnalogClock: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const radiusRef = useRef<number>(0);
  const prevBlockRef = useRef<{ color: string } | null>(null);

  // Update clock border color only if the block changes
  const updateClockBorderColor = (currentBlock: { color: string } | null) => {
    const clockElement = document.getElementById("analogClock");
    if (clockElement && currentBlock !== prevBlockRef.current) {
      let newColor = currentBlock ? currentBlock.color : "#333"; // Default color
      clockElement.style.setProperty(
        "border",
        `6px solid ${darkenBlockColor(newColor, 0.4)}`,
        "important"
      );
      prevBlockRef.current = currentBlock; // Update the ref
    }
  };

  // Adjust the canvas size dynamically
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      // Dynamically set width and height based on container size
      canvas.width = width;
      canvas.height = height;

      radiusRef.current = Math.min(width, height) / 2; // Ensure the radius is based on the smaller dimension

      ctxRef.current?.resetTransform(); // Reset any previous transformations
      ctxRef.current?.translate(radiusRef.current, radiusRef.current); // Re-center after resize
    }
  };

  useEffect(() => {
    const handleResize = debounce(() => resizeCanvas(), 100);
    window.addEventListener("resize", handleResize);

    resizeCanvas(); // Initial setup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function debounce(func: Function, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Function to draw the glow effect around the entire clock
  const drawGlow = (ctx: CanvasRenderingContext2D | null, radius: number) => {
    if (!ctx) return;

    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.6)");
    grad.addColorStop(0.7, "rgba(255, 255, 255, 0.1)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = grad;
    ctx.fill();
  };

  // Function to draw the clock face
  const drawFace = (
    ctx: CanvasRenderingContext2D | null,
    radius: number,
    borderColor: string
  ) => {
    if (!ctx) return;
    const grad = ctx.createRadialGradient(
      0,
      0,
      radius * 0.95,
      0,
      0,
      radius * 1.05
    );
    grad.addColorStop(0, borderColor);
    grad.addColorStop(0.5, borderColor);
    grad.addColorStop(1, borderColor);

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.strokeStyle = grad;
    ctx.lineWidth = radius * 0.1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = borderColor;
    ctx.fill();
  };

  // Function to draw the numbers on the clock
  const drawNumbers = (
    ctx: CanvasRenderingContext2D | null,
    radius: number
  ) => {
    if (!ctx) return;
    ctx.font = radius * 0.15 + "px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (let num = 1; num < 13; num++) {
      let ang = (num * Math.PI) / 6;
      ctx.rotate(ang);
      ctx.translate(0, -radius * 0.85);
      ctx.rotate(-ang);
      ctx.fillStyle = "white";
      ctx.fillText(num.toString(), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, radius * 0.85);
      ctx.rotate(-ang);
    }
  };

  // Function to draw stylish hands
  const drawStylishHand = (
    ctx: CanvasRenderingContext2D,
    pos: number,
    length: number,
    width: number,
    color: string
  ) => {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.strokeStyle = color;
    ctx.stroke();

    const pivotLength = width * 0.4; // Adjust this for a better effect
    ctx.beginPath();
    ctx.lineWidth = width * 0.3;
    ctx.moveTo(0, 0);
    ctx.lineTo(0, pivotLength);
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.rotate(-pos); // Reset rotation to avoid affecting other elements
  };

  // Function to draw the clock hands
  const drawTime = (
    ctx: CanvasRenderingContext2D,
    radius: number,
    borderColor: string
  ) => {
    const now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();

    hour =
      ((hour % 12) * Math.PI) / 6 +
      (minute * Math.PI) / (6 * 60) +
      (second * Math.PI) / (360 * 60);
    drawStylishHand(ctx, hour, radius * 0.5, radius * 0.1, borderColor); // Hour hand

    minute = (minute * Math.PI) / 30 + (second * Math.PI) / (30 * 60);
    drawStylishHand(ctx, minute, radius * 0.8, radius * 0.07, borderColor); // Minute hand

    second = (second * Math.PI) / 30;
    drawStylishHand(ctx, second, radius * 0.9, radius * 0.02, "#ff0000"); // Second hand
  };

  // Draw the clock on the canvas
  const drawClock = () => {
    const ctx = ctxRef.current;
    const radius = radiusRef.current;
    if (ctx) {
      ctx.clearRect(-radius, -radius, 2 * radius, 2 * radius); // Clear canvas

      const currentBlock = getCurrentBlock(new Date());
      const borderColor = currentBlock ? currentBlock.color : "#333";
      updateClockBorderColor(currentBlock); // Update the border color if the block changes

      // Draw static elements (face, glow, numbers) once
      drawFace(ctx, radius, borderColor);
      drawGlow(ctx, radius);
      drawNumbers(ctx, radius);

      // Draw dynamic elements (the clock hands)
      drawTime(ctx, radius, borderColor); // Draw the hands

      // Continue the animation loop
      requestAnimationFrame(drawClock);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      ctxRef.current = canvas.getContext("2d");
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      // Start the clock drawing process
      drawClock();

      return () => {
        window.removeEventListener("resize", resizeCanvas);
      };
    }
  }, []); // Only run once when the component is mounted

  return (
    <div className="analog-clock-container">
      <canvas
        id="analogClock"
        ref={canvasRef}
        className="no-darkreader"
        width={400}
        height={400}
      />
    </div>
  );
};

export default AnalogClock;

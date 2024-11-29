import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
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

function debounce(func: Function, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    if (timeout) clearTimeout(timeout); // Clear previous timeout
    timeout = setTimeout(() => func(...args), wait);
  };
}

const AnalogClock: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clockRef = useRef<HTMLDivElement>(null); // Ref for the clock div
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const radiusRef = useRef<number>(0);
  const prevBlockRef = useRef<{ color: string } | null>(null);

  const [currentTime, setCurrentTime] = useState<Date>(new Date()); // State for current time
  const [shouldRedrawStatic, setShouldRedrawStatic] = useState(true); // State to track static redraw

  // Function to draw static elements (face, glow, numbers)
  const drawStaticElements = (
    ctx: CanvasRenderingContext2D | null,
    radius: number,
    borderColor: string
  ) => {
    if (!ctx || !shouldRedrawStatic) return;

    drawFace(ctx, radius, borderColor);
    drawGlow(ctx, radius);
    drawNumbers(ctx, radius);

    setShouldRedrawStatic(false); // Set to false after drawing static elements
  };

  // Update clock border color only if the block changes
  const updateClockBorderColor = (currentBlock: { color: string } | null) => {
    if (
      clockRef.current &&
      canvasRef.current &&
      currentBlock !== prevBlockRef.current
    ) {
      const newColor = currentBlock ? currentBlock.color : "#333"; // Default color

      canvasRef.current.style.setProperty(
        "border",
        `6px solid ${darkenBlockColor(newColor, 0.4)}`,
        "important"
      );
      prevBlockRef.current = currentBlock;
      setShouldRedrawStatic(true); // Trigger static elements redraw when block changes
    }
  };

  // Adjust the canvas size dynamically
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      // Check if the size has actually changed
      if (canvas.width !== width || canvas.height !== height) {
        // Set the new canvas size
        canvas.width = width;
        canvas.height = height;

        // Update the radius based on the new size
        radiusRef.current = Math.min(width, height) / 2;

        // Get the 2D rendering context and reset transformations
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.resetTransform(); // Reset any previous transformations
          ctx.translate(radiusRef.current, radiusRef.current); // Center the drawing context
          ctxRef.current = ctx; // Update the context reference
        }

        setShouldRedrawStatic(true); // Trigger static elements redraw
      }
    }
  };

  useLayoutEffect(() => {
    const handleResize = debounce(resizeCanvas, 100); // debounce the resize function
    window.addEventListener("resize", handleResize);
    resizeCanvas(); // Initial setup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      const ang = (num * Math.PI) / 6;
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

      const now = new Date();
      const currentBlock = getCurrentBlock(new Date());
      const borderColor = currentBlock ? currentBlock.color : "#333";
      updateClockBorderColor(currentBlock); // Update the border color if the block changes

      // Draw static elements (face, glow, numbers) once
      drawStaticElements(ctx, radius, borderColor);

      // Draw dynamic elements (the clock hands)
      drawTime(ctx, radius, borderColor); // Draw the hands

      setCurrentTime(now); // Update time for ARIA updates
      // Continue the animation loop
      requestAnimationFrame(drawClock);
    }
  };

  useEffect(() => {
    drawClock(); // Start the animation loop
  }, []);

  return (
    <div
      ref={clockRef} // Attach the ref to the clock container
      className="analog-clock-container"
      role="group"
      aria-labelledby="clock-label"
      aria-live="polite"
    >
      <span id="clock-label" className="visually-hidden">
        Analog clock displaying the current time.
      </span>
      <span aria-live="polite" className="visually-hidden">
        {`Current time: ${currentTime.toLocaleTimeString()}. Current rate: ${
          getCurrentBlock(currentTime)?.name ?? "Unknown"
        }.`}
      </span>
      <canvas
        id="analogClock"
        ref={canvasRef}
        aria-hidden="true" // Mark canvas as hidden because it's a visual-only representation
        className="no-darkreader"
        width={400}
        height={400}
      />
    </div>
  );
};

export default AnalogClock;

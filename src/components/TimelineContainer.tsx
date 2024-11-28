import React, { useEffect, useRef, useState } from "react";
import "../styles/TimelineContainer.css";
import anime from "animejs"; // Import anime.js
import Tooltip from "./TimelineTooltip"; // Import the Tooltip component

const TimelineContainer: React.FC = () => {
  const arrowRef = useRef<HTMLDivElement | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null); // Track hovered block index
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0 });

  const tariffBlocks = [
    { start: 20, end: 6, color: "green" }, // Nocturno
    { start: 6, end: 10, color: "orange" }, // Valle
    { start: 10, end: 12.5, color: "red" }, // Punta
    { start: 12.5, end: 17.5, color: "orange" }, // Valle
    { start: 17.5, end: 20, color: "red" }, // Punta
  ];

  const tariffCosts = { nocturno: 28.3, valle: 67.65, punta: 165.01 };
  const totalBlocks = 24;

  const updateTimeline = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    const currentTimeInSeconds =
      currentHour * 3600 + currentMinute * 60 + currentSecond;
    const totalSecondsInDay = 24 * 3600;
    const position = (currentTimeInSeconds / totalSecondsInDay) * 100;

    if (arrowRef.current) {
      anime({
        targets: arrowRef.current,
        left: `${position}%`,
        duration: 1000,
        easing: "linear",
      });
    }
  };

  useEffect(() => {
    const intervalId = setInterval(updateTimeline, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      left: rect.left + rect.width / 2,
      top: rect.top - rect.height - 10,
    });
    setHoveredBlock(index);
  };

  const handleMouseLeave = () => {
    setHoveredBlock(null);
  };

  const renderBlocks = () => {
    return Array.from({ length: totalBlocks }, (_, i) => {
      const hour = i;
      let color = "";
      let splitHour = false; // Flag to indicate if the current hour should be split

      for (const tariff of tariffBlocks) {
        if (
          (tariff.start > tariff.end &&
            (hour >= tariff.start || hour < tariff.end)) ||
          (hour >= tariff.start && hour < tariff.end)
        ) {
          color = tariff.color;
          break;
        }
      }

      const convertedHour = i % 12 || 12;

      // Check if the current block is 12 or 17 for splitting
      if (i === 12 || i === 17) {
        splitHour = true;
      }

      return (
        <div
          key={i}
          className="timeline-block"
          style={{ backgroundColor: color }}
          onMouseEnter={(e) => handleMouseEnter(e, i)}
          onMouseLeave={handleMouseLeave}
        >
          {splitHour ? (
            <div className="square-container">
              <div
                className="left-half"
                style={{ backgroundColor: i === 12 ? "red" : "orange" }}
              ></div>
              <div
                className="right-half"
                style={{ backgroundColor: i === 12 ? "orange" : "red" }}
              ></div>
              <div className="content">{i === 12 ? 12 : 5}</div>
            </div>
          ) : (
            convertedHour
          )}

          {hoveredBlock === i && (
            <div
              className="tooltip-container"
              style={{ left: tooltipPosition.left, top: tooltipPosition.top }}
            >
              <Tooltip
                hour={`${convertedHour}:00`}
                hourPeriod={i >= 12 ? "PM" : "AM"}
                color={color}
                tariffCost={(color === "red"
                  ? tariffCosts.punta
                  : color === "orange"
                  ? tariffCosts.valle
                  : tariffCosts.nocturno
                ).toString()}
              />
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="timeline-container">
      <div className="timeline">{renderBlocks()}</div>
      <div className="arrow" ref={arrowRef}></div>
    </div>
  );
};

export default TimelineContainer;

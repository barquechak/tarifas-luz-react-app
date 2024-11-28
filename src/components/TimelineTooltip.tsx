// Tooltip.tsx
import React from "react";
import "../styles/TimelineTooltip.css";

interface TooltipProps {
  hour: string;
  hourPeriod: string;
  color: string;
  tariffCost: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  hour,
  hourPeriod,
  color,
  tariffCost,
}) => (
  /*
  <div className="custom-tooltip">
    <div className="hour-period-container">
      {hour} {hourPeriod}
    </div>
    <div className="color-tariff-container">
      <div className="tooltip-square" style={{ backgroundColor: color }}></div>
      Costo Tarifa (₡): {tariffCost}
    </div>
  </div>
  */
  <>
    {hour}
    {hourPeriod}
    {color}
    {tariffCost}
  </>
);

export default Tooltip;

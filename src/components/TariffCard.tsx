import React from "react";
import "../styles/TariffCard.css";

interface TariffCardProps {
  color: string;
  title: string;
  timeInfo: { start: string; end: string }[];
  block: string;
  tariff: string;
}

const TariffCard: React.FC<TariffCardProps> = ({
  color,
  title,
  timeInfo,
  tariff,
  block,
}) => {
  return (
    <div className={`card ${color}`}>
      <div className="card-header">{title}</div>
      <div className={`time-info-${block}`}>
        {timeInfo.map(({ start, end }, index) => (
          <div key={index}>
            {start} - {end}
            {index < timeInfo.length - 1 && <br />}
          </div>
        ))}
      </div>
      <div className="tariff">{tariff}</div>
    </div>
  );
};

export default TariffCard;

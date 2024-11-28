import { useEffect, useState } from "react";
import "../styles/TariffBannerContainer.css";

const TariffBannerContainer: React.FC = () => {
  const [currentBlock, setCurrentBlock] = useState({
    name: "Cargando...", // Default message while loading
    color: "gray", // Neutral color while loading
  });

  const now = new Date();
  const timeBlocksDigital = [
    { name: "₡28.30 por kWh", color: "green", start: "20:01", end: "06:00" },
    { name: "₡67.65 por kWh", color: "orange", start: "06:01", end: "10:00" },
    { name: "₡165.01 por kWh", color: "red", start: "10:01", end: "12:30" },
    { name: "₡67.65 por kWh", color: "orange", start: "12:31", end: "17:30" },
    { name: "₡165.01 por kWh", color: "red", start: "17:31", end: "20:00" },
  ];

  // This function will be used to set the current block
  function updateTariffBanner() {
    const currentBlock = getCurrentBlock(now);
    if (currentBlock) {
      setCurrentBlock(currentBlock);
    }
  }

  useEffect(() => {
    updateTariffBanner(); // Trigger the first update immediately
    const interval = setInterval(() => {
      updateTariffBanner();
    }, 60000); // Update every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, []); // Empty dependency array ensures it runs once

  function getCurrentBlock(now: Date) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes(); // Minutes since midnight

    for (const block of timeBlocksDigital) {
      const { start, end } = block;
      const startMinutes = getMinutesSinceMidnight(start);
      const endMinutes = getMinutesSinceMidnight(end);

      if (startMinutes <= endMinutes) {
        // Same-day block
        if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
          return block;
        }
      } else {
        // Overnight block (e.g., Nocturno from 8 PM to 6 AM)
        if (currentMinutes >= startMinutes || currentMinutes <= endMinutes) {
          return block;
        }
      }
    }

    return null; // No matching block
  }

  function getMinutesSinceMidnight(time: string) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  return (
    <span id="current-block" className={`${currentBlock.color} fade-in`}>
      {`Actualmente: ${currentBlock.name}`}
    </span>
  );
};

export default TariffBannerContainer;

import { useEffect, useState } from "react";
import "../styles/DigitalClockContainer.css";

const DigitalClockContainer: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      // Only update the state if the seconds or minutes change
      if (currentTime.getSeconds() !== time.getSeconds()) {
        setTime(currentTime);
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [time]); // Add `time` as a dependency to check only the second change

  return (
    <>
      <span id="current-time">{time.toLocaleTimeString()}</span>
    </>
  );
};

export default DigitalClockContainer;

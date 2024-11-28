import { useEffect, useState } from "react";
import "../styles/digitalClock.css";

const DigitalClockContainer: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <span id="current-time">{time.toLocaleTimeString()}</span>
    </>
  );
};

export default DigitalClockContainer;

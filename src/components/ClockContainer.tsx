import AnalogClockContainer from "./AnalogClockContainer";
import DigitalClockContainer from "./DigitalClockContainer";
import TimelineContainer from "./TimelineContainer";
import TariffBannerContainer from "./TariffBannerContainer";
import "../styles/ClockContainer.css";

function ClockContainer() {
  return (
    <>
      <div className="clock-container">
        <TariffBannerContainer />
        <AnalogClockContainer />
        <TimelineContainer />
        <DigitalClockContainer />
      </div>
    </>
  );
}

export default ClockContainer;

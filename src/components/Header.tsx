import ClockContainer from "./ClockContainer";
import CardContainer from "./CardContainer";
import "../styles/Header.css";

const Header: React.FC = () => {
  return (
    <>
      <header>
        <h1>Información de Tarifas Eléctricas</h1>
        <ClockContainer />
        <CardContainer />
      </header>
    </>
  );
};
export default Header;

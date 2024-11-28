import TariffCard from "./TariffCard";
import "../styles/CardContainer.css";

const tariffData = [
  {
    color: "red",
    title: "Costo alto kWh",
    timeInfo: [
      { start: "10:01 A.M.", end: "12:30 P.M." },
      { start: "05:31 P.M.", end: "08:00 P.M." },
    ],
    block: "punta",
    tariff: "₡165.01 por kWh",
  },
  {
    color: "orange",
    title: "Costo medio kWh",
    timeInfo: [
      { start: "06:01 A.M.", end: "10:00 A.M." },
      { start: "12:31 P.M.", end: "05:30 P.M." },
    ],
    block: "valle",
    tariff: "₡67.65 por kWh",
  },
  {
    color: "green",
    title: "Costo bajo kWh",
    timeInfo: [{ start: "08:01 P.M.", end: "06:00 A.M." }],
    block: "nocturno",
    tariff: "₡28.30 por kWh",
  },
];

const CardContainer: React.FC = () => {
  return (
    <div className="cards-container">
      {tariffData.map((card, index) => (
        <TariffCard
          key={index}
          color={card.color}
          title={card.title}
          timeInfo={card.timeInfo}
          block={card.block}
          tariff={card.tariff}
        />
      ))}
    </div>
  );
};

export default CardContainer;

import Header from "./components/Header";
import GraphContainer from "./components/GraphContainer";
import ClockContainer from "./components/ClockContainer";
import CardContainer from "./components/CardContainer";
import Footer from "./components/Footer";
import "./App.css";

const App: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <main>
          <section id="clock">
            <ClockContainer />
          </section>

          <section id="cards">
            <CardContainer />
          </section>

          <section id="graph">
            <GraphContainer />
          </section>
        </main>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default App;

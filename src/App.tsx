import Header from "./components/Header";
import GraphContainer from "./components/GraphContainer";
import "./App.css";

const App: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <GraphContainer />
      </main>
    </>
  );
};

export default App;

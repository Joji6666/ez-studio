import InstrumentSelector from "./ui/instrumentSelector/InstrumentSelector";
import Pad from "./ui/pad/Pad";
import "./main.scss";
const Main = () => {
  return (
    <main>
      <InstrumentSelector />
      <Pad />
    </main>
  );
};

export default Main;

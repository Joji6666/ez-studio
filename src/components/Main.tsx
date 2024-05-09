import InstrumentSelector from "./ui/instrumentSelector/InstrumentSelector";
import Pad from "./ui/pad/Pad";
import "./main.scss";
import PlayList from "./ui/playList/PlayList";
const Main = () => {
  return (
    <main>
      <InstrumentSelector />
      <Pad />
      <PlayList />
    </main>
  );
};

export default Main;

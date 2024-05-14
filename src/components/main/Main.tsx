import InstrumentSelector from "../ui/instrumentSelector/InstrumentSelector";
import Pad from "../ui/pad/Pad";
import "./main.scss";
import PlayList from "../ui/playList/PlayList";
import TopToolbar from "../ui/topToolbar.tsx/TopToolbar";

const Main = () => {
  return (
    <main>
      <TopToolbar />
      <InstrumentSelector />
      <Pad />
      <PlayList />
    </main>
  );
};

export default Main;

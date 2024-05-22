import InstrumentSelector from "../ui/instrumentSelector/InstrumentSelector";
import Pad from "../ui/pad/Pad";
import TopToolbar from "../ui/topToolbar.tsx/TopToolbar";
import PlayList from "../ui/playList/PlayList";
import "./main.scss";

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

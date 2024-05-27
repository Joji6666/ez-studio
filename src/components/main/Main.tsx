import InstrumentSelector from "../ui/instrumentSelector/InstrumentSelector";
import Pad from "../ui/pad/Pad";
import TopToolbar from "../ui/topToolbar.tsx/TopToolbar";
import PlayList from "../ui/playList/PlayList";
import "./main.scss";
import Modal from "../ui/shared/modal/Modal";

const Main = () => {
  return (
    <main>
      <TopToolbar />
      <InstrumentSelector />
      <Pad />
      <PlayList />
      <Modal />
    </main>
  );
};

export default Main;

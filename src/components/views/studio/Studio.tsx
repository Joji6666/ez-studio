import "./style/studio.scss";
import TopToolbar from "../../ui/topToolbar.tsx/TopToolbar";
import InstrumentSelector from "../../ui/instrumentSelector/InstrumentSelector";
import Pad from "../../ui/pad/Pad";
import PlayList from "../../ui/playList/PlayList";
import Modal from "../../ui/shared/modal/Modal";

const Studio = () => {
  return (
    <div className="studio-container">
      <TopToolbar />
      <InstrumentSelector />
      <Pad />
      <PlayList />
      <Modal />
    </div>
  );
};

export default Studio;

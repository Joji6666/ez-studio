import "./style/top_toolbar.scss";
import usePlayList from "../playList/store/usePlayList";
import AudioVisualizer from "./AudioVisualizer";
import useTopToolbar from "./store/useTopToolbar";
import useModal from "../shared/modal/store/useModal";

const TopToolbar = () => {
  const { handleBpm, handleNoteValue, handleSave } = useTopToolbar();
  const { isPlayListPlaying, handleStart, handleTimelineReset } = usePlayList();
  const { handleModal } = useModal();
  const noteValues: { label: string; key: string }[] = [
    { label: "1n", key: "1n" },
    { label: "2n", key: "2n" },
    { label: "4n", key: "4n" },
    { label: "8n", key: "8n" },
    { label: "16n", key: "16n" },
    { label: "32n", key: "32n" },
  ];

  return (
    <section className="top-toolbar-section">
      <div className="bpm-controller-wrapper">
        <label>4/4</label>
      </div>

      <div className="bpm-controller-wrapper">
        <label>BPM</label>
        <input
          type="number"
          onChange={handleBpm}
          min="5"
          max="300"
          defaultValue={120}
        />
      </div>
      <div className="note-value-controller">
        <label>NOTE</label>
        <select
          name="noteValue"
          onChange={handleNoteValue}
          defaultValue={"16n"}
        >
          {noteValues.map((note) => (
            <option key={note.key} value={note.key}>
              {note.label}
            </option>
          ))}
        </select>
      </div>
      <div className="start-botton-wrapper">
        <button onClick={handleStart}>
          <img
            src={!isPlayListPlaying ? "icons/play.svg" : "icons/pause.svg"}
            width={15}
            height={15}
            alt={!isPlayListPlaying ? "play" : "pause"}
          />
        </button>
        <button onClick={handleTimelineReset}>
          <img src={"icons/stop.svg"} width={15} height={15} alt="reset" />
        </button>

        <button>
          <img
            src={"icons/recording.svg"}
            width={15}
            height={15}
            alt="recording"
          />
        </button>
      </div>
      <div className="effector-icon-wrapper">
        <button onClick={() => handleModal("Effector", "open")}>
          <img
            src={"icons/effector.svg"}
            width={40}
            height={40}
            alt="play-btn"
          />
        </button>
      </div>

      <div className="save-icon-wrapper">
        <button onClick={handleSave}>
          <img src={"icons/save.svg"} width={40} height={40} alt="save-btn" />
        </button>
      </div>

      <div className="analizer-wrapper">
        <AudioVisualizer />
      </div>
    </section>
  );
};

export default TopToolbar;

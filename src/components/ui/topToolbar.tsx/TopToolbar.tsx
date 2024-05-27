import "./style/top_toolbar.scss";
import usePlayList from "../playList/store/usePlayList";
import AudioVisualizer from "./AudioVisualizer";
import useTopToolbar from "./store/useTopToolbar";
import useModal from "../shared/modal/store/useModal";

const TopToolbar = () => {
  const { handleBpm, handleNoteValue } = useTopToolbar();
  const { handleStart, handleTimelineReset } = usePlayList();
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
      <input
        type="number"
        onChange={handleBpm}
        min="5"
        max="300"
        defaultValue={120}
      />

      <select
        name="padTrackList"
        onChange={handleNoteValue}
        defaultValue={"8n"}
      >
        {noteValues.map((note) => (
          <option key={note.key} value={note.key}>
            {note.label}
          </option>
        ))}
      </select>

      <button onClick={handleStart}>start</button>
      <button onClick={handleTimelineReset}>reset</button>
      <button onClick={() => handleModal("Effector", "open")}>Effector</button>

      <AudioVisualizer />
    </section>
  );
};

export default TopToolbar;

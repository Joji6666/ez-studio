import usePlayList from "../playList/store/usePlayList";
import AudioVisualizer from "./AudioVisualizer";
import useTopToolbar from "./store/useTopToolbar";

const TopToolbar = () => {
  const { handleBpm } = useTopToolbar();
  const { handleStart } = usePlayList();

  return (
    <section>
      <input
        type="number"
        onChange={handleBpm}
        min="5"
        max="300"
        defaultValue={120}
      />
      <button onClick={handleStart}>start</button>
      <AudioVisualizer />
    </section>
  );
};

export default TopToolbar;

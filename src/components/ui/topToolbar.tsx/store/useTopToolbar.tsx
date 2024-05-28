import * as Tone from "tone";
import { create } from "zustand";
import { ITopToolbar } from "../util/top_toolbar_interface";
import usePlayList from "../../playList/store/usePlayList";

const useTopToolbar = create<ITopToolbar>((set) => ({
  bpm: 120,
  analyzer: null,
  noteValue: "16n",
  handleBpm: (e: React.ChangeEvent<HTMLInputElement>) => {
    Tone.Transport.bpm.value = Number(e.target.value);

    set(() => ({ bpm: Number(e.target.value) }));
  },
  handleNoteValue: (e: React.ChangeEvent<HTMLSelectElement>) => {
    const measureBarMaxWidth = usePlayList.getState().measureBarMaxWidth;
    const calculateMeasureWidth = usePlayList.getState().calculateMeasureWidth;
    const measureWidth = calculateMeasureWidth(e.target.value, 7);

    const numberOfMeasures = Math.ceil(
      measureBarMaxWidth > 1500
        ? measureBarMaxWidth
        : (measureWidth * 36) / measureWidth
    );

    usePlayList.setState({
      measureWidth,
      measures: numberOfMeasures,
    });

    set(() => ({
      noteValue: e.target.value,
    }));
  },
}));

export default useTopToolbar;

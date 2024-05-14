import * as Tone from "tone";
import { create } from "zustand";
import { ITopToolbar } from "../util/top_toolbar_interface";

const useTopToolbar = create<ITopToolbar>((set) => ({
  bpm: 120,
  analyzer: null,
  handleBpm: (e: React.ChangeEvent<HTMLInputElement>) => {
    Tone.Transport.bpm.value = Number(e.target.value);

    set(() => ({ bpm: Number(e.target.value) }));
  },
}));

export default useTopToolbar;

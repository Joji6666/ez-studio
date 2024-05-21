import * as Tone from "tone";
import { create } from "zustand";
import { ITopToolbar } from "../util/top_toolbar_interface";

const useTopToolbar = create<ITopToolbar>((set) => ({
  bpm: 120,
  analyzer: null,
  noteValue: "8n",
  handleBpm: (e: React.ChangeEvent<HTMLInputElement>) => {
    Tone.Transport.bpm.value = Number(e.target.value);

    set(() => ({ bpm: Number(e.target.value) }));
  },
  handleNoteValue: (e: React.ChangeEvent<HTMLSelectElement>) => {
    set(() => ({
      noteValue: e.target.value,
    }));
  },
}));

export default useTopToolbar;

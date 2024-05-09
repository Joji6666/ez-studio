import { create } from "zustand";
import type {
  IPlayListTrack,
  IPlayListStore,
} from "../util/play_list_interface";

const usePlayList = create<IPlayListStore>((set) => ({
  tracks: [],

  initPlayList: () => {
    const newPlayListBlocks: IPlayListTrack[] = [];
    const playListSection = document.querySelector(".play-list-section");

    set(() => ({
      tracks: newPlayListBlocks,
    }));
  },
}));

export default usePlayList;

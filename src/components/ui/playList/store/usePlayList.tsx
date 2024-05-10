import { create } from "zustand";
import type {
  IPlayListTrack,
  IPlayListStore,
} from "../util/play_list_interface";
import { v1 } from "uuid";

const usePlayList = create<IPlayListStore>((set) => ({
  playListTracks: [],
  totalStep: 0,
  initPlayList: () => {
    const newPlayListBlocks: IPlayListTrack[] = [];
    const playListWrapper = document.querySelector(
      ".play-list-wrapper"
    ) as HTMLElement;

    if (playListWrapper) {
      const wrapperHeight = playListWrapper.offsetHeight;
      const trackHeight = 50;
      const trackCount = Math.floor(wrapperHeight / trackHeight);

      for (let index = 0; index < trackCount; index++) {
        const newTrackOption: IPlayListTrack = {
          id: v1(),
          instrument: { url: "", name: "", group: "" },
          patterns: [],
          height: 0,
          trackName: `track${index + 1}`,
        };

        newPlayListBlocks.push(newTrackOption);
      }
    }

    set(() => ({
      playListTracks: newPlayListBlocks,
    }));
  },
}));

export default usePlayList;

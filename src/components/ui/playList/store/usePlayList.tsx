import { create } from "zustand";
import type {
  IPlayListTrack,
  IPlayListStore,
  IPattern,
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
      const wrapperWidth = playListWrapper.offsetWidth;
      const trackWidth = 50;
      const trackHeight = 50;
      const trackHeightCount = Math.floor(wrapperHeight / trackHeight);
      const trackWidthCount = Math.floor(wrapperWidth / trackWidth);

      for (let index = 0; index < trackHeightCount + 1; index++) {
        const newTrackOption: IPlayListTrack = {
          id: v1(),
          instrument: { url: "", name: "", group: "" },
          patterns: [],
          height: 0,
          trackName: `track${index + 1}`,
        };

        newPlayListBlocks.push(newTrackOption);
      }

      newPlayListBlocks.forEach((block) => {
        for (let index = 0; index < trackWidthCount + 2; index++) {
          const newPattern: IPattern = {
            id: v1(),
            length: 16,
            x: 0,
          };

          block.patterns.push(newPattern);
        }
      });
    }

    set(() => ({
      playListTracks: newPlayListBlocks,
    }));
  },
}));

export default usePlayList;

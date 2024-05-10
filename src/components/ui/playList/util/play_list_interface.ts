import type { IInstrument } from "../../pad/util/pad_interface";

export interface IPlayListStore {
  totalStep: number;
  playListTracks: IPlayListTrack[];
  initPlayList: () => void;
}

export interface IPlayListTrack {
  id: string;
  height: number;
  trackName: string;
  patterns: IPattern[];
  instrument?: IInstrument;
}

export interface IPattern {
  id: string;
}

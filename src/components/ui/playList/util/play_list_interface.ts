import type { IInstrument } from "../../instrumentSelector/util/instrument_selector_interface";

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
  length: number;
  x: number;
}

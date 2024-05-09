import type { ITrack } from "../../pad/util/pad_interface";

export interface IPlayListStore {
  tracks: IPlayListTrack[];
}

export interface IPlayListTrack {
  track: IPlayListTrack;
}

export interface IPlayListTrack extends ITrack {
  x: number;
  width: number;
}

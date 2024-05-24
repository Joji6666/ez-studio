import type { IInstrument } from "../../instrumentSelector/util/instrument_selector_interface";
import * as Tone from "tone";
export interface IPlayListStore {
  currentStep: number;
  totalStep: number;
  playListTracks: IPlayListTrack[];
  isPlayListPlaying: boolean;
  playListSequence: Tone.Sequence<number> | undefined;
  timelinePosition: number;
  measureBarMaxWidth: number;
  scrollX: number;
  isDragging: boolean;
  dragStartX: number;
  selectedPattern: IPattern | null;
  selectedTrackId: string;
  insertTrack: () => void;
  handleStart: () => void;
  increaseStep: () => void;
  initPlayList: () => void;
  handleScroll: (scrollX: number) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  handleMouseUp: () => void;
  handleMouseDown: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    trackId: string,
    pattern: IPattern
  ) => void;
}

export interface IPlayListTrack {
  id: string;
  height: number;
  trackName: string;
  patterns: IPattern[];
  instrument?: IInstrument;
  trackId: string;
}

export interface IPattern {
  id: string;
  length: number;
  x: number;
  pattern: IPlayListPattern[];
  totalDuration: number;
}

export interface IPlayListPattern {
  id: string;
  instrument: IInstrument;
  steps: IPlayListStep[];
}

export interface IPlayListStep {
  id: string;
  isChecked: boolean;
}

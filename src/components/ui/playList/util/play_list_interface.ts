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
  checkedSteps: ICheckedStep[];
  timelineAnimationId: number | null;
  measureWidth: number;
  measures: number;
  effectors: (Tone.Reverb | Tone.Analyser)[];

  // functions
  insertTrack: () => void;
  handleStart: () => void;
  initPlayList: () => void;
  handleScroll: (scrollX: number) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  handleMouseUp: () => void;
  handleMouseDown: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    trackId: string,
    pattern: IPattern
  ) => void;

  handleInstrumentDrop: (
    e: React.DragEvent<HTMLDivElement>,
    trackIndex: number
  ) => void;
  handleTimelineReset: () => void;
  calculateMeasureWidth: (noteValue: string, baseWidth: number) => number;
  initMeasure: () => void;
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

export interface ICheckedStep {
  childPatternIndex: string | undefined;
  patternIndex: string | undefined;
  stepId: string | undefined;
  trackIndex: string | undefined;
  rect: DOMRect;
  instrument: IInstrument;
}

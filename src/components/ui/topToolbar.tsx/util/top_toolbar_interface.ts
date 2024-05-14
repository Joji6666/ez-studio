import * as Tone from "tone";

export interface ITopToolbar {
  bpm: number;
  analyzer: null | Tone.Analyser;
  handleBpm: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

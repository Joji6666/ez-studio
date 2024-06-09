import * as Tone from "tone";
import { IEffector } from "../../shared/modal/components/effector/util/effector_controller_interface";
import {
  IPattern,
  IPlayListTrack,
} from "../../playList/util/play_list_interface";

export interface ITopToolbar {
  bpm: number;
  analyzer: null | Tone.Analyser;
  noteValue: string;
  projects: IProject[];
  handleBpm: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNoteValue: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSave: () => void;
  getProjects: () => void;
}

export interface IProject {
  id: number;
  projectName: string;
  effectorList: IEffector[];
  playListTracks: IPlayListTrack[];
  patterns: IPattern[];
}

export interface IProjectResponse {
  id: number;
  projectData: string;
  projectName: string;
}

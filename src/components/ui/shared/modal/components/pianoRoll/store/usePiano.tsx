import { create } from "zustand";
import { IPianoStore } from "../util/piano_interface";

const usePiano = create<IPianoStore>((set) => ({
  notes: [],

  generateNotes: () => {
    const notes: string[] = [];
    const pitches: string[] = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];
    for (let octave = 0; octave <= 10; octave++) {
      for (const pitch of pitches) {
        notes.push(`${pitch}${octave}`);
      }
    }

    set(() => ({ notes: notes.reverse() }));

    return notes.reverse();
  },

  calculateTotalDuration: (bpm, timeSignature, width) => {
    // timeSignature는 문자열 형식의 "4/4"를 받음
    const [beatsPerMeasure, noteValue] = timeSignature.split("/").map(Number);

    // 16분음표 개수 계산 (8px 당 1개의 16분음표)
    const sixteenthNotes = width / 8;

    // 한 마디의 16분음표 개수 (4/4 박자일 경우 한 마디에 16개의 16분음표)
    const sixteenthNotesPerMeasure = beatsPerMeasure * (16 / noteValue);

    // 초당 박자 수 (BPM / 60)
    const beatsPerSecond = bpm / 60;

    // 한 박자의 길이 (초)
    const secondsPerBeat = 1 / beatsPerSecond;

    // 한 마디의 길이 (초)
    const secondsPerMeasure = secondsPerBeat * beatsPerMeasure;

    // 한 마디의 16분음표 길이 (초)
    const secondsPerSixteenthNote =
      secondsPerMeasure / sixteenthNotesPerMeasure;

    // 전체 길이 (초)
    const totalDuration = secondsPerSixteenthNote * sixteenthNotes;

    return totalDuration;
  },
}));

export default usePiano;

import { v1 } from "uuid";
import { create } from "zustand";
import * as Tone from "tone";
import { instruments } from "../../../../constatns/instruments";
import type { IPadPattern, IPadStore, ITrack } from "../util/pad_interface";
import useInstrument from "../../instrumentSelector/store/useInstrument";
import useTopToolbar from "../../topToolbar.tsx/store/useTopToolbar";

const usePad = create<IPadStore>((set, get) => ({
  // values
  tracks: [],
  steps: 16,
  loadedInstrument: {},
  selectedTrackId: "track1",
  selectedTrack: {
    trackName: "",
    id: "",
    patterns: [],
    totalDuration: 0,
  },
  padSequence: undefined,
  isPadPlaying: false,
  // functions
  addTrack: () => {
    const steps = get().steps;
    const track = get().tracks;

    const newTrack: ITrack = {
      id: v1(),
      trackName: `track${track.length + 1}`,
      patterns: [
        {
          id: v1(),
          instrument: instruments[0],
          steps: [],
        },
        {
          id: v1(),
          instrument: instruments[1],
          steps: [],
        },
        {
          id: v1(),
          instrument: instruments[2],
          steps: [],
        },
        {
          id: v1(),
          instrument: instruments[3],
          steps: [],
        },
      ],
      totalDuration: 0,
    };

    newTrack.patterns.forEach((pattern) => {
      for (let index = 0; index < steps; index++) {
        pattern.steps.push({
          id: v1(),
          isChecked: false,
        });
      }
    });

    set((state) => ({
      tracks: [...state.tracks, newTrack],
    }));
  },
  initPad: () => {
    const basicPadSetup: IPadPattern[] = [
      {
        id: v1(),
        instrument: instruments[0],
        steps: [],
      },
      {
        id: v1(),
        instrument: instruments[1],
        steps: [],
      },
      {
        id: v1(),
        instrument: instruments[2],
        steps: [],
      },
      {
        id: v1(),
        instrument: instruments[3],
        steps: [],
      },
    ];

    basicPadSetup.forEach((pad) => {
      const steps = get().steps;
      for (let index = 0; index < steps; index++) {
        pad.steps.push({ id: v1(), isChecked: false });
      }
    });

    const newTrack: ITrack = {
      id: v1(),
      trackName: "track1",
      patterns: basicPadSetup,
      totalDuration: 0,
    };

    set(() => ({
      tracks: [newTrack],
      selectedTrack: newTrack,
      selectedTrackId: newTrack.id,
    }));
  },

  handleCheck: (
    trackIndex: number,
    patternIndex: number,
    stepIndex: number
  ) => {
    const selectedTrackId = get().selectedTrackId;
    const tempTracks = structuredClone(get().tracks);

    if (selectedTrackId === tempTracks[trackIndex].id) {
      const targetPattern = tempTracks[trackIndex].patterns[patternIndex];
      const targetStep = targetPattern.steps[stepIndex];
      if (targetStep) {
        if (targetStep.isChecked) {
          tempTracks[trackIndex].patterns[patternIndex].steps[
            stepIndex
          ].isChecked = false;
        } else {
          tempTracks[trackIndex].patterns[patternIndex].steps[
            stepIndex
          ].isChecked = true;
        }
      }
    }

    set(() => ({
      tracks: tempTracks,
    }));
  },
  handleDrop: (
    e: React.DragEvent<HTMLDivElement>,
    trackIndex: number,
    patternIndex: number
  ) => {
    e.preventDefault();

    const tempTracks = structuredClone(get().tracks);
    const selectedIns = useInstrument.getState().selectedIns;

    tempTracks[trackIndex].patterns[patternIndex].instrument = selectedIns;

    set(() => ({
      tracks: tempTracks,
    }));
  },
  handleTrackSelect: (e: React.ChangeEvent<HTMLSelectElement>) => {
    const parsedValue: ITrack = JSON.parse(e.target.value);

    set(() => ({
      selectedTrackId: parsedValue.id,
      selectedTrack: parsedValue,
    }));
  },

  handlePadPlay: async () => {
    const isPadPlaying = get().isPadPlaying;
    const padSequence = get().padSequence;
    const steps = get().steps;
    const tracks = get().tracks;
    const noteValue = useTopToolbar.getState().noteValue;
    const selectedTrackId = get().selectedTrackId;
    const loadedInstrument = useInstrument.getState().loadedInstrument;
    const bpm = useTopToolbar.getState().bpm;
    const analyzer = useTopToolbar.getState().analyzer;

    await Tone.start(); // Tone 오디오 컨텍스트를 활성화
    if (isPadPlaying) {
      set(() => ({
        isPadPlaying: false,
      }));
      if (padSequence) {
        padSequence.dispose(); // 컴포넌트 언마운트 시 시퀀스 해제
      }

      if (analyzer) {
        analyzer.dispose();
        useTopToolbar.setState({ analyzer: null });
      }

      Tone.Transport.stop();
    } else {
      Tone.Transport.bpm.value = bpm; // BPM 설정

      // 이펙트 초기화
      // const pitchShift = new Tone.PitchShift(1).toDestination();

      // const totalDuration = calculateSequenceDuration(120, steps, "8n");
      const analyzer = new Tone.Analyser("fft", 32);

      const newSequence = new Tone.Sequence(
        (time, step) => {
          console.log(time, "time", step, "step@");
          tracks.forEach((track) => {
            if (selectedTrackId === track.id) {
              track.patterns.forEach((pattern) => {
                const currentStep = pattern.steps[step % steps];
                if (currentStep.isChecked) {
                  const instrument = loadedInstrument[pattern.instrument.url];
                  instrument.connect(analyzer);
                  analyzer.toDestination();
                  instrument.start(time); // 오디오 재생
                }
              });
            }
          });
        },
        Array.from({ length: steps }, (_, i) => i),
        noteValue
      );

      newSequence.start(0);
      useTopToolbar.setState({ analyzer });
      set(() => ({
        isPadPlaying: true,
        padSequence: newSequence,
      }));

      Tone.Transport.start();
    }
  },
}));

export default usePad;

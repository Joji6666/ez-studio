import { v1 } from "uuid";
import { create } from "zustand";
import * as Tone from "tone";
import { instruments } from "../../../../constatns/instruments";
import type {
  IPatternInstrument,
  IPadStore,
  IPattern,
  IPadPianoNote,
} from "../util/pad_interface";
import useInstrument from "../../instrumentSelector/store/useInstrument";
import useTopToolbar from "../../topToolbar.tsx/store/useTopToolbar";
import useEffectorController from "../../shared/modal/components/effector/store/useEffectorController";

const usePad = create<IPadStore>((set, get) => ({
  // values
  patterns: [],
  steps: 16,
  loadedInstrument: {},
  selectedPatternId: "pattern1",
  selectedInstrumentId: null,
  selectedPattern: {
    patternName: "",
    id: "",
    instruments: [],
    totalDuration: 0,
  },
  padSequence: undefined,
  isPadPlaying: false,
  // functions
  addPattern: () => {
    const steps = get().steps;
    const patterns = get().patterns;

    const newPattern: IPattern = {
      id: v1(),
      patternName: `pattern${patterns.length + 1}`,
      instruments: [
        {
          id: v1(),
          instrument: { url: "", name: "", group: "" },
          steps: [],
        },
      ],
      totalDuration: 0,
    };

    newPattern.instruments.forEach((pattern) => {
      for (let index = 0; index < steps; index++) {
        pattern.steps.push({
          id: v1(),
          isChecked: false,
        });
      }
    });

    set((state) => ({
      patterns: [...state.patterns, newPattern],
    }));
  },
  addInstrument: () => {
    const patterns = structuredClone(get().patterns);
    const selectedPatternId = get().selectedPatternId;
    const targetPattern = patterns.find(
      (pattern) => pattern.id === selectedPatternId
    );
    if (targetPattern) {
      const newOption: IPatternInstrument = {
        id: v1(),
        instrument: {
          url: "",
          name: "synth",
          group: "synth",
        },
        isPiano: true,
        steps: [],
        pianoSteps: {
          id: v1(),
          notes: [],
        },
      };

      const notes: IPadPianoNote[] = [];

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

      pitches.forEach((pitch) => {
        for (let index = 0; index <= 10; index++) {
          if (newOption.pianoSteps) {
            notes.push({
              noteName: `${pitch}${index}`,
              noteValues: [],
            });
          }
        }
      });

      notes.reverse();
      if (newOption.pianoSteps) {
        newOption.pianoSteps.notes = notes;
      }

      targetPattern.instruments.push(newOption);
    }

    set(() => ({ patterns }));
  },

  initPad: () => {
    const basicPadSetup: IPatternInstrument[] = [
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

    const newPattern: IPattern = {
      id: v1(),
      patternName: "pattern1",
      instruments: basicPadSetup,
      totalDuration: 0,
    };

    set(() => ({
      patterns: [newPattern],
      selectedPattern: newPattern,
      selectedPatternId: newPattern.id,
    }));
  },

  handleCheck: (
    patternIndex: number,
    instrumentIndex: number,
    stepIndex: number
  ) => {
    const selectedPatternId = get().selectedPatternId;
    const tempPatterns = structuredClone(get().patterns);

    if (selectedPatternId === tempPatterns[patternIndex].id) {
      const targetPattern =
        tempPatterns[patternIndex].instruments[instrumentIndex];
      const targetStep = targetPattern.steps[stepIndex];
      if (targetStep) {
        if (targetStep.isChecked) {
          tempPatterns[patternIndex].instruments[instrumentIndex].steps[
            stepIndex
          ].isChecked = false;
        } else {
          tempPatterns[patternIndex].instruments[instrumentIndex].steps[
            stepIndex
          ].isChecked = true;
        }
      }
    }

    set(() => ({
      patterns: tempPatterns,
    }));
  },
  handleDrop: (
    e: React.DragEvent<HTMLDivElement>,
    patternIndex: number,
    instrumentIndex: number
  ) => {
    e.preventDefault();

    const tempPattenrs = structuredClone(get().patterns);
    const selectedIns = useInstrument.getState().selectedIns;

    tempPattenrs[patternIndex].instruments[instrumentIndex].instrument =
      selectedIns;

    set(() => ({
      patterns: tempPattenrs,
    }));
  },
  handlePatternSelect: (e: React.ChangeEvent<HTMLSelectElement>) => {
    const parsedValue: IPattern = JSON.parse(e.target.value);

    set(() => ({
      selectedPatternId: parsedValue.id,
      selectedPattern: parsedValue,
    }));
  },

  handlePadPlay: async () => {
    const isPadPlaying = get().isPadPlaying;
    const padSequence = get().padSequence;
    const steps = get().steps;
    const patterns = get().patterns;
    const selectedPatternId = get().selectedPatternId;
    const noteValue = useTopToolbar.getState().noteValue;

    const loadedInstrument = useInstrument.getState().loadedInstrument;
    const bpm = useTopToolbar.getState().bpm;
    const analyzer = useTopToolbar.getState().analyzer;
    const targetPattern = patterns.find(
      (pattern) => pattern.id === selectedPatternId
    );

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
      const reverb = new Tone.Reverb().toDestination();
      const newSequence = new Tone.Sequence(
        (time, step) => {
          if (targetPattern) {
            const connectedEffector: {
              [key: string]: { [key: string]: number | string };
            } = {};

            if (targetPattern.effector) {
              targetPattern.effector.slots.forEach((slot) => {
                if (slot.connectedEffector) {
                  Object.entries(slot.value).forEach(([key, value]) => {
                    connectedEffector[key] = value;
                  });
                }
              });
            }

            targetPattern.instruments.forEach((instrument) => {
              const currentStep = instrument.steps[step % steps];
              if (currentStep.isChecked) {
                const targetInstrument =
                  loadedInstrument[instrument.instrument.url];
                targetInstrument.connect(analyzer);
                analyzer.toDestination();
                if (Object.keys(connectedEffector).length > 0) {
                  Object.entries(connectedEffector).forEach(([key, value]) => {
                    if (key === "reverb") {
                      targetInstrument.connect(reverb);
                      reverb.decay = value.decay;
                    }
                  });
                }
                targetInstrument.start(time); // 오디오 재생
              }
            });
          }
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
  handleEffector: (effectorIndex: number) => {
    const patterns = structuredClone(get().patterns);
    const selectedPatternId = get().selectedPatternId;
    const targetPattern = patterns.find(
      (pattern) => pattern.id === selectedPatternId
    );
    const effectorList = useEffectorController.getState().effectorList;
    const targetEffector = effectorList[effectorIndex];

    if (targetPattern) {
      if (targetEffector) {
        targetPattern.effector = targetEffector;

        set(() => ({
          patterns,
        }));
      }
    }
  },
  handleInstrumentSelect: (instrumentId: string) => {
    set(() => ({ selectedInstrumentId: instrumentId }));
  },
}));

export default usePad;

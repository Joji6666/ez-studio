import { create } from "zustand";
import * as Tone from "tone";
import type {
  IPlayListTrack,
  IPlayListStore,
  IPattern,
} from "../util/play_list_interface";
import { v1 } from "uuid";
import { calculateSequenceDuration } from "../../../../lib/common_function";
import usePad from "../../pad/store/usePad";
import useInstrument from "../../instrumentSelector/store/useInstrument";
import useTopToolbar from "../../topToolbar.tsx/store/useTopToolbar";

const usePlayList = create<IPlayListStore>((set, get) => ({
  currentStep: 0,
  playListTracks: [],
  totalStep: 0,
  isPlayListPlaying: false,
  playListSequence: undefined,
  timelinePosition: 0,
  measureBarMaxWidth: 0,
  scrollX: 0,
  isDragging: false,
  dragStartX: 0,
  selectedPattern: null,
  selectedTrackId: "",
  insertTrack: () => {
    const { tracks, selectedTrackId } = usePad.getState();
    const playListTracks = structuredClone(get().playListTracks);
    const targetPlayListTrack = playListTracks.find(
      (playListTrack) => playListTrack.trackId === selectedTrackId
    );

    const selectedTrack = tracks.find((track) => track.id === selectedTrackId);

    const totalDuration = calculateSequenceDuration(120, 16, "8n");
    if (targetPlayListTrack && selectedTrack) {
      targetPlayListTrack.patterns.push({
        id: v1(),
        length: selectedTrack.patterns.length,
        x: 0,
        pattern: selectedTrack.patterns,
        totalDuration,
      });

      set((state) => ({
        playListTracks,
        totalStep: state.totalStep + selectedTrack.patterns[0].steps.length,
      }));
    } else {
      if (selectedTrack) {
        const emptyTrack = playListTracks.find(
          (playListTrack) => playListTrack.trackId === ""
        );

        if (emptyTrack) {
          emptyTrack.trackName = selectedTrack.trackName;
          emptyTrack.trackId = selectedTrack.id;
          emptyTrack.patterns.push({
            id: v1(),
            length: selectedTrack.patterns.length,
            x: 0,
            pattern: selectedTrack.patterns,
            totalDuration,
          });

          set(() => ({
            playListTracks,
          }));
        } else {
          const newTrackOption: IPlayListTrack = {
            id: v1(),
            instrument: { url: "", name: "", group: "" },
            patterns: [
              {
                id: v1(),
                length: selectedTrack.patterns.length,
                x: 0,
                pattern: selectedTrack.patterns,
                totalDuration,
              },
            ],
            height: 0,
            trackName: selectedTrack.trackName,
            trackId: selectedTrack.id,
          };

          set((state) => ({
            playListTracks: [...state.playListTracks, newTrackOption],
            totalStep: state.totalStep + selectedTrack.patterns[0].steps.length,
          }));
        }
      }
    }

    let maxPatternWidth = 0;
    playListTracks.forEach((playListTrack) => {
      playListTrack.patterns.forEach((pattern) => {
        const patternWidth =
          pattern.pattern[0].steps.length * 7 * playListTrack.patterns.length;
        if (patternWidth > maxPatternWidth) {
          maxPatternWidth = patternWidth;
        }
      });
    });

    set(() => ({
      measureBarMaxWidth: maxPatternWidth + 500,
    }));
  },
  handleStart: async () => {
    const playListTracks = get().playListTracks;
    const isPlayListPlaying = get().isPlayListPlaying;
    const playListSequence = get().playListSequence;
    const bpm = useTopToolbar.getState().bpm;

    const { loadedInstrument } = useInstrument.getState();
    await Tone.start(); // Tone 오디오 컨텍스트를 활성화
    if (isPlayListPlaying) {
      set(() => ({
        isPlayListPlaying: false,
      }));

      if (playListSequence) {
        playListSequence.dispose(); // 컴포넌트 언마운트 시 시퀀스 해제
      }

      Tone.Transport.stop();
    } else {
      Tone.Transport.bpm.value = bpm; // BPM 설정

      //   const newSequence = new Tone.Sequence(
      //     (time, step) => {
      //       playListTracks.forEach((playListTrack) => {
      //         playListTrack.patterns.forEach((pattern) => {
      //           pattern.pattern.forEach((childPattern) => {
      //             const currentStep = childPattern.steps[step % 16];

      //             if (currentStep.isChecked) {
      //               const instrument =
      //                 loadedInstrument[childPattern.instrument.url];
      //               instrument.start(time); // 오디오 재생
      //             }
      //           });
      //         });
      //       });
      //     },
      //     Array.from({ length: 16 }, (_, i) => i),
      //     "8n"
      //   );

      //   newSequence.start(0);

      set(() => ({
        isPlayListPlaying: true,
        // playListSequence: newSequence,
      }));

      Tone.Transport.start();
    }
  },
  handleScroll: (scrollX: number) => {
    set(() => ({
      scrollX,
    }));
  },
  handleMouseDown: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    trackId: string,
    pattern: IPattern
  ) => {
    set(() => ({
      isDragging: true,
      dragStartX: e.clientX - pattern.x,
      selectedTrackId: trackId,
      selectedPattern: pattern,
    }));
  },

  handleMouseMove: (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const isDragging = get().isDragging;

    if (isDragging) {
      const dragStartX = get().dragStartX;
      const selectedPattern = get().selectedPattern;
      const selectedTrackId = get().selectedTrackId;
      const playListTracks = structuredClone(get().playListTracks);

      const targetTrack = playListTracks.find(
        (playListTrack) => playListTrack.id === selectedTrackId
      );
      const newElementX = e.clientX - dragStartX; // 새로운 x 위치 계산

      const playListTrackContentWrapper = document.querySelector(
        ".play-list-track-content-pattern-wrapper-container"
      );

      if (targetTrack && playListTrackContentWrapper && selectedPattern) {
        const targetPatternElement = document.querySelector(
          `#pattern-${selectedPattern.id}`
        );

        const targetPattern = targetTrack.patterns.find(
          (pattern) => pattern.id === selectedPattern.id
        );

        if (targetPattern) {
          if (targetPatternElement) {
            const targetPatternElementClientRectLeft =
              targetPatternElement.getBoundingClientRect().left;
            const playListTrackContentWrapperClientRectLeft =
              playListTrackContentWrapper.getBoundingClientRect().left;

            const elementGap =
              targetPatternElementClientRectLeft -
              playListTrackContentWrapperClientRectLeft;

            if (elementGap >= 0) {
              targetPattern.x = newElementX;
            }

            if (elementGap < 0) {
              targetPattern.x = targetPattern.x + 1;
            }
          }
        }
      }

      set(() => ({
        playListTracks,
      }));
    }
  },

  handleMouseUp: () => {
    set(() => ({
      isDragging: false,
    }));
  },
  increaseStep: () => {
    set((state) => ({
      currentStep: state.currentStep + 1,
    }));
  },
  initPlayList: () => {
    const tracks: IPlayListTrack[] = [];
    for (let index = 0; index < 19; index++) {
      const newTrack: IPlayListTrack = {
        id: v1(),
        height: 0,
        trackName: "",
        patterns: [],
        trackId: "",
      };

      tracks.push(newTrack);
    }

    set(() => ({
      playListTracks: tracks,
    }));
  },
}));

export default usePlayList;

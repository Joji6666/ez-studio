import { create } from "zustand";
import * as Tone from "tone";
import type {
  IPlayListTrack,
  IPlayListStore,
  IPattern,
  ICheckedStep,
} from "../util/play_list_interface";
import { v1 } from "uuid";
import { calculateSequenceDuration } from "../../../../lib/common_function";
import usePad from "../../pad/store/usePad";
import useTopToolbar from "../../topToolbar.tsx/store/useTopToolbar";

const usePlayList = create<IPlayListStore>((set, get) => ({
  // values

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
  checkedSteps: [],

  // fuctions

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
    const isPlayListPlaying = get().isPlayListPlaying;
    const playListSequence = get().playListSequence;
    const bpm = useTopToolbar.getState().bpm;

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
    const checkedSteps = document.querySelectorAll(".pattern-step");

    if (checkedSteps.length > 0) {
      const newCheckedSteps: ICheckedStep[] = [];
      checkedSteps.forEach((stepEl) => {
        const element = stepEl as HTMLElement;

        const { childPatternIndex, patternIndex, stepId, trackIndex } =
          element.dataset;

        const newCheckedStepOption: ICheckedStep = {
          childPatternIndex,
          patternIndex,
          stepId,
          trackIndex,
          rect: element.getBoundingClientRect(),
        };

        newCheckedSteps.push(newCheckedStepOption);
      });
      set(() => ({
        checkedSteps: newCheckedSteps,
      }));
    }

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
    const handleScroll = get().handleScroll;

    const measureBarWrapper = document.querySelector(
      ".play-list-measure-bar-wrapper"
    );

    // Measure bar 스크롤 이벤트 리스너
    if (measureBarWrapper) {
      measureBarWrapper.addEventListener("scroll", function () {
        handleScroll(measureBarWrapper.scrollLeft);
      });
    }

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

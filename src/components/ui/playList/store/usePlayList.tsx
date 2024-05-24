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
import useInstrument from "../../instrumentSelector/store/useInstrument";

let xPo = 0;

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
  timelineAnimationId: null,
  measureWidth: 0,
  measures: 0,

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
    const checkedSteps = get().checkedSteps;
    const playListTracks = get().playListTracks;
    const bpm = useTopToolbar.getState().bpm;
    const loadedInstrument = useInstrument.getState().loadedInstrument;
    const timelineAnimationId = get().timelineAnimationId;
    await Tone.start(); // Tone 오디오 컨텍스트를 활성화
    if (isPlayListPlaying) {
      if (playListSequence) {
        playListSequence.dispose(); // 컴포넌트 언마운트 시 시퀀스 해제
      }

      if (timelineAnimationId) {
        cancelAnimationFrame(timelineAnimationId);
      }

      set(() => ({
        isPlayListPlaying: false,
        timelineAnimationId: null,
      }));
      Tone.Transport.stop();
    } else {
      Tone.Transport.bpm.value = bpm; // BPM 설정
      const analyzer = new Tone.Analyser("fft", 32);

      const checkedStepsRects = checkedSteps.map((step) => step.rect);

      const stepDuration = (60 * 1000) / bpm; // 한 스텝의 지속 시간 계산 (ms)
      const baseWidth = 7; // 각 스텝의 기준 이동 거리 (px)
      let lastTime = 0; // 마지막 프레임의 시간을 저장할 변수
      const playedStep: { [key: string]: string } = {};
      const render = (time: number) => {
        if (!lastTime) lastTime = time; // 처음 프레임의 시간을 저장
        const deltaTime = time - lastTime; // 두 프레임 간의 시간 차이 계산
        lastTime = time; // 현재 프레임의 시간을 lastTime으로 업데이트

        xPo += ((baseWidth * deltaTime) / stepDuration) * 2;

        const timelinebarElement = document.querySelector(".timeline-bar-line");
        if (timelinebarElement) {
          const element = timelinebarElement as HTMLElement;
          element.style.transform = `translateX(${xPo}px)`;

          const timelineBarRect = element.getBoundingClientRect();

          checkedStepsRects.forEach((rect, index) => {
            if (
              Math.round(timelineBarRect.right) === Math.round(rect.left) &&
              Math.round(rect.right) === Math.round(timelineBarRect.left + 9)
            ) {
              const step = checkedSteps[index];
              if (
                step.trackIndex &&
                step.patternIndex &&
                step.childPatternIndex
              ) {
                if (
                  step.stepId &&
                  playedStep[step.stepId] !== step.patternIndex
                ) {
                  const instrument =
                    loadedInstrument[
                      playListTracks[Number(step.trackIndex)].patterns[
                        Number(step.patternIndex)
                      ].pattern[Number(step.childPatternIndex)].instrument.url
                    ];
                  instrument.connect(analyzer);
                  analyzer.toDestination();
                  instrument.start();
                  playedStep[step.stepId] = step.patternIndex;
                }
              }
            }
          });
        }
        set(() => ({
          timelineAnimationId: requestAnimationFrame(render),
        }));
      };

      requestAnimationFrame(render);

      set(() => ({
        isPlayListPlaying: true,
        // playListSequence: newSequence,
      }));
      useTopToolbar.setState({ analyzer });
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
  initMeasure: () => {
    const noteValue = useTopToolbar.getState().noteValue;
    const measureBarMaxWidth = get().measureBarMaxWidth;
    const calculateMeasureWidth = get().calculateMeasureWidth;
    const measureWidth = calculateMeasureWidth(noteValue, 7);

    const numberOfMeasures = Math.ceil(
      measureBarMaxWidth > 1500
        ? measureBarMaxWidth
        : (measureWidth * 36) / measureWidth
    );

    set({
      measureWidth,
      measures: numberOfMeasures,
    });
  },

  calculateMeasureWidth: (noteValue: string, baseWidth: number) => {
    const convertNoteValue = Number(noteValue.replace("n", ""));
    const widthPerStep = baseWidth * (convertNoteValue / 4);
    return widthPerStep * convertNoteValue; // 한 마디의 길이 계산
  },
}));

export default usePlayList;

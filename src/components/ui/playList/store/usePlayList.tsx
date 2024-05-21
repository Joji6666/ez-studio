import { create } from "zustand";
import * as Tone from "tone";
import type {
  IPlayListTrack,
  IPlayListStore,
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
  trackListWrapperScrollHeight: 0,
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
        const trackListWrapper = document.querySelector(".track-list-wrapper");

        if (trackListWrapper) {
          set(() => ({
            trackListWrapperScrollHeight: trackListWrapper.scrollHeight,
          }));
        }
        set((state) => ({
          playListTracks: [...state.playListTracks, newTrackOption],
          totalStep: state.totalStep + selectedTrack.patterns[0].steps.length,
        }));
      }
    }
  },
  handleStart: async () => {
    const playListTracks = get().playListTracks;
    const isPlayListPlaying = get().isPlayListPlaying;
    const playListSequence = get().playListSequence;
    const totalStep = get().totalStep;
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

      const newSequence = new Tone.Sequence(
        (time, step) => {
          playListTracks.forEach((playListTrack) => {
            playListTrack.patterns.forEach((pattern) => {
              pattern.pattern.forEach((childPattern) => {
                const currentStep = childPattern.steps[step % 16];

                if (currentStep.isChecked) {
                  const instrument =
                    loadedInstrument[childPattern.instrument.url];
                  instrument.start(time); // 오디오 재생
                }
              });
            });
          });
        },
        Array.from({ length: 16 }, (_, i) => i),
        "8n"
      );

      newSequence.start(0);

      set(() => ({
        isPlayListPlaying: true,
        playListSequence: newSequence,
      }));

      Tone.Transport.start();
    }
  },
  increaseStep: () => {
    set((state) => ({
      currentStep: state.currentStep + 1,
    }));
  },
}));

export default usePlayList;

import { useState, useEffect } from "react";

import * as Tone from "tone";
import "./style/pad.scss";

import usePad from "./store/usePad";
import useInstrument from "../instrumentSelector/store/useInstrument";

const Pad = () => {
  const {
    trakcs,
    steps,
    selectedTrack,
    addTrack,
    initPad,
    handleCheck,
    handleDrop,
    handleTrackSelect,
  } = usePad();
  const { loadedInstrument } = useInstrument();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [sequence, setSequence] = useState<Tone.Sequence<number> | undefined>(
    undefined
  );

  const handleStart = async () => {
    await Tone.start(); // Tone 오디오 컨텍스트를 활성화
    if (isPlaying) {
      setIsPlaying(false);
      if (sequence) {
        sequence.dispose(); // 컴포넌트 언마운트 시 시퀀스 해제
      }
      Tone.Transport.stop();
    } else {
      setIsPlaying(true);

      Tone.Transport.bpm.value = 120; // BPM 설정
      const newSequence = new Tone.Sequence(
        (time, step) => {
          trakcs.forEach((track) => {
            if (selectedTrack === track.id) {
              track.patterns.forEach((pattern) => {
                const currentStep = pattern.steps[step % steps];
                if (currentStep.isChecked) {
                  const instrument = loadedInstrument[pattern.instrument.url];
                  instrument.start(time); // 오디오 재생
                }
              });
            }
          });
        },
        Array.from({ length: steps }, (_, i) => i),
        "8n"
      );

      newSequence.start(0);
      setSequence(newSequence);

      Tone.Transport.start();
    }
  };

  useEffect(() => {
    return () => {
      if (sequence) {
        sequence.dispose(); // 컴포넌트 언마운트 시 시퀀스 해제
      }
    };
  }, []);

  useEffect(() => {
    if (trakcs.length === 0) {
      initPad();
    }
  }, [trakcs]);

  return (
    <section className="pad-section">
      <article className="pad-article">
        <div className="track-toolbar">
          <select name="padTrackList" onChange={handleTrackSelect}>
            {trakcs.map((track) => (
              <option key={track.id} value={track.id}>
                {track.trackName}
              </option>
            ))}
          </select>
          <div className="track-toolbar-button-wrapper">
            <button onClick={handleStart}>start</button>
            <button onClick={addTrack}>Add Track</button>
          </div>
        </div>
        {trakcs.map(
          (track, trackIndex) =>
            selectedTrack === track.id && (
              <div key={track.id} className="pad-track-wrapper">
                {track.patterns.map((pattern, patternIndex: number) => (
                  <div className="pattern-wrapper" key={pattern.id}>
                    <div
                      className="selected-audio-wrapper"
                      onDrop={(e) => handleDrop(e, trackIndex, patternIndex)}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <span>{`${pattern.instrument.name ?? "악기 선택"}`}</span>
                    </div>
                    <div className="checkbox-wrapper">
                      {pattern.steps.map((step, stepIndex: number) => (
                        <div key={step.id} className="checkbox-content">
                          <input
                            className="checkbox-input"
                            id={step.id}
                            type="checkbox"
                            onChange={() =>
                              handleCheck(trackIndex, patternIndex, stepIndex)
                            }
                            checked={step.isChecked}
                          />
                          <label htmlFor={step.id}></label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
        )}
      </article>
    </section>
  );
};

export default Pad;

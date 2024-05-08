import { useState, useEffect } from "react";

import * as Tone from "tone";
import "./style/pad.scss";
import { instruments } from "../../../constatns/instruments";
import usePad from "./store/usePad";
import type { ILoadedInstrument } from "./util/pad_interface";

const Pad = () => {
  const {
    trakcs,
    steps,
    loadedInstrument,
    addTrack,
    initPad,
    setLoadedInstrument,
    handleCheck,
  } = usePad();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [sequence, setSequence] = useState<Tone.Sequence<number> | undefined>(
    undefined
  );

  const loadAudio = async () => {
    const loaders = instruments.map((sample) =>
      new Tone.Player(sample.url).toDestination()
    );
    const loadedMedias = await Promise.all(loaders);

    const medias = instruments.reduce((acc, sample, index) => {
      acc[sample.url] = loadedMedias[index];
      return acc;
    }, {} as ILoadedInstrument);

    await Tone.loaded().then(() => {
      // 페이지 로드 시 한 번만 초기화
      setLoadedInstrument(medias);
    });
  };

  const handleStart = async () => {
    Tone.Transport.bpm.value = 120; // BPM 설정
    const newSequence = new Tone.Sequence(
      (time, step) => {
        trakcs.forEach((track) => {
          if (track.steps[step % steps].isChecked) {
            loadedInstrument[track.instrument.url].start(time);
          }
        });
      },
      Array.from({ length: steps }, (_, i) => i),
      "16n"
    );

    newSequence.start(0);
    setSequence(newSequence);

    await Tone.start(); // Tone 오디오 컨텍스트를 활성화
    if (isPlaying) {
      setIsPlaying(false);
      Tone.Transport.stop();
    } else {
      setIsPlaying(true);
      Tone.Transport.start();
    }
  };

  useEffect(() => {
    loadAudio();

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
        {trakcs.map((track, trackIndex: number) => (
          <div key={track.id} className="track-wrapper">
            <div className="selected-audio-wrapper">
              <span>{`${track.instrument.name ?? "악기 선택"}`}</span>
            </div>
            <div className="checkbox-wrapper">
              {track.steps.map((step, stepIndex: number) => (
                <div key={step.id} className="checkbox-content">
                  <input
                    className="checkbox-input"
                    id={step.id}
                    type="checkbox"
                    onChange={() => handleCheck(trackIndex, stepIndex)}
                  />
                  <label htmlFor={step.id}></label>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={handleStart}>start</button>
        <button onClick={addTrack}>Add Track</button>
      </article>
    </section>
  );
};

export default Pad;

import { useState, useEffect } from "react";
import { v1 } from "uuid";

import * as Tone from "tone";
import "../../styles/pad.scss";
import { instruments } from "../../utils/instruments";

interface ISamples {
  [key: string]: Tone.Player;
}

const Pad = () => {
  const [stepIds, setStepIds] = useState<string[]>([]);
  const [trackIds, setTrackIds] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [allLoaded, setAllLoaded] = useState<boolean>(false);
  const [medias, setMedias] = useState<ISamples>({});
  const [sequence, setSequence] = useState<Tone.Sequence<number> | undefined>(
    undefined
  );

  const loadAudio = async () => {
    const loaders = instruments.map((sample) =>
      new Tone.Player(sample.url).toDestination()
    );
    const loadedMedias = await Promise.all(loaders);

    const medias = instruments.reduce((acc, sample, index) => {
      acc[sample.name] = loadedMedias[index];
      return acc;
    }, {} as ISamples);

    await Tone.loaded().then(() => {
      setMedias(medias);
      setAllLoaded(true);
    });
  };

  const handleCheck = (trackId: string, stepId: string) => {
    console.log(trackId, stepId);
  };

  const handleStart = async () => {
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
    const step = 16;
    const stepIds = [];
    const trackIds = [];
    for (let index = 0; index < step; index++) {
      stepIds.push(v1());
    }

    trackIds.push(v1());
    trackIds.push(v1());
    trackIds.push(v1());
    trackIds.push(v1());

    setStepIds(stepIds);

    setTrackIds(trackIds);
    loadAudio();
  }, []);

  useEffect(() => {
    if (allLoaded && stepIds.length > 0 && Object.keys(medias).length > 0) {
      // 페이지 로드 시 한 번만 초기화
      Tone.Transport.bpm.value = 120; // BPM 설정
      const newSequence = new Tone.Sequence(
        (time, step) => {
          medias[instruments[step % instruments.length].name].start(time);
        },
        Array.from({ length: stepIds.length }, (_, i) => i),
        "16n"
      );

      newSequence.start(0);
      setSequence(newSequence);

      return () => {
        if (sequence) {
          sequence.dispose(); // 컴포넌트 언마운트 시 시퀀스 해제
        }
      };
    }
  }, [allLoaded, stepIds.length, medias]); // 오디오 로드 완료 및 stepIds 설정 확인

  return (
    <section className="pad-section">
      {allLoaded && (
        <article className="pad-article">
          {trackIds.map((trackId) => (
            <div key={trackId} className="track-wrapper">
              <div className="selected-audio-wrapper">
                <span>선택 된 악기</span>
              </div>
              <div className="checkbox-wrapper">
                {stepIds.map((stepId) => (
                  <div key={stepId} className="checkbox-content">
                    <input
                      className="checkbox-input"
                      id={stepId}
                      type="checkbox"
                      onChange={() => handleCheck(trackId, stepId)}
                    />
                    <label htmlFor={stepId}></label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </article>
      )}
      <button onClick={handleStart}>start</button>
    </section>
  );
};

export default Pad;

import { useEffect } from "react";
import "./style/pad.scss";
import usePad from "./store/usePad";
import usePlayList from "../playList/store/usePlayList";
import useEffectorController from "../shared/modal/components/effector/store/useEffectorController";

const Pad = () => {
  const {
    tracks,
    selectedTrackId,
    isPadPlaying,
    addTrack,
    initPad,
    handleCheck,
    handleDrop,
    handleTrackSelect,
    handlePadPlay,
    handleEffector,
  } = usePad();
  const { insertTrack } = usePlayList();
  const { effectorList } = useEffectorController();

  useEffect(() => {
    if (tracks.length === 0) {
      initPad();
    }
  }, [tracks]);

  return (
    <section className="pad-section">
      <article className="pad-article">
        <div className="track-toolbar">
          <select name="padTrackList" onChange={handleTrackSelect}>
            {tracks.map((track) => (
              <option key={track.id} value={JSON.stringify(track)}>
                {track.trackName}
              </option>
            ))}
          </select>

          <div className="track-toolbar-button-wrapper">
            <button onClick={handlePadPlay} className="pad-play-botton">
              <img
                src={!isPadPlaying ? "icons/play.svg" : "icons/pause.svg"}
                width={15}
                height={15}
                alt="play-btn"
              />
            </button>
            <button onClick={addTrack}>Add Pattern</button>
            <button onClick={insertTrack}>Insert Pattern</button>
          </div>
          <div className="effector-plugin-wrapper">
            <img
              src={"icons/plugin.svg"}
              width={15}
              height={15}
              alt="effector-plugin"
            />

            <select
              name="padEffectorList"
              onChange={(e) => handleEffector(Number(e.target.value))}
            >
              <option value={undefined}></option>
              {effectorList.map((effector, effectorIndex) => (
                <option key={effector.id} value={effectorIndex}>
                  {effector.effectorName}
                </option>
              ))}
            </select>
          </div>
        </div>
        {tracks.map(
          (track, trackIndex) =>
            selectedTrackId === track.id && (
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
                    <div className="effector-plugin-wrapper">
                      <img
                        src={"icons/plugin.svg"}
                        width={15}
                        height={15}
                        alt="effector-plugin"
                      />

                      <select
                        name="padEffectorList"
                        onChange={(e) => handleEffector(Number(e.target.value))}
                      >
                        <option value={undefined}></option>
                        {effectorList.map((effector, effectorIndex) => (
                          <option key={effector.id} value={effectorIndex}>
                            {effector.effectorName}
                          </option>
                        ))}
                      </select>
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

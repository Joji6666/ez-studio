import { useEffect } from "react";
import "./style/pad.scss";
import usePad from "./store/usePad";
import usePlayList, { noteValues } from "../playList/store/usePlayList";

const Pad = () => {
  const {
    tracks,
    selectedTrackId,
    addTrack,
    initPad,
    handleCheck,
    handleDrop,
    handleTrackSelect,
    handleNoteValue,
    handlePadPlay,
  } = usePad();
  const { insertTrack } = usePlayList();

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

          <select
            name="padTrackList"
            onChange={handleNoteValue}
            defaultValue={"8n"}
          >
            {noteValues.map((note) => (
              <option key={note.key} value={note.key}>
                {note.label}
              </option>
            ))}
          </select>

          <div className="track-toolbar-button-wrapper">
            <button onClick={handlePadPlay}>start</button>
            <button onClick={addTrack}>Add Track</button>
            <button onClick={insertTrack}>Insert Track</button>
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

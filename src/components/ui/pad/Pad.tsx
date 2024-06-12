import { useEffect } from "react";
import "./style/pad.scss";
import usePad from "./store/usePad";
import usePlayList from "../playList/store/usePlayList";
import useEffectorController from "../shared/modal/components/effector/store/useEffectorController";

import useModal from "../shared/modal/store/useModal";
import { v1 } from "uuid";

const Pad = () => {
  const {
    patterns,
    selectedPatternId,
    isPadPlaying,
    addPattern,
    addInstrument,
    initPad,
    handleCheck,
    handleDrop,
    handlePatternSelect,
    handlePadPlay,
    handleEffector,
    handleInstrumentSelect,
  } = usePad();
  const { insertPattern } = usePlayList();
  const { effectorList } = useEffectorController();
  const { handleModal } = useModal();

  useEffect(() => {
    if (patterns.length === 0) {
      initPad();
    }
  }, [patterns]);

  return (
    <section className="pad-section">
      <article className="pad-article">
        <div className="pattern-toolbar">
          <select name="padTrackList" onChange={handlePatternSelect}>
            {patterns.map((pattern) => (
              <option key={pattern.id} value={JSON.stringify(pattern)}>
                {pattern.patternName}
              </option>
            ))}
          </select>

          <div className="pattern-toolbar-button-wrapper">
            <button onClick={handlePadPlay} className="pad-play-botton">
              <img
                src={!isPadPlaying ? "icons/play.svg" : "icons/pause.svg"}
                width={15}
                height={15}
                alt="play-btn"
              />
            </button>
            <button onClick={addPattern}>Add Pattern</button>
            <button onClick={insertPattern}>Insert Pattern</button>
          </div>

          <div className="pad-piano-button-wrapper">
            <button
              onClick={() => handleModal("PianoRoll", "open")}
              className="pad-piano-botton"
            >
              <img
                src={"/icons/piano.svg"}
                width={20}
                height={20}
                alt="piano-btn"
              />
            </button>
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
        {patterns.map(
          (pattern, patternIndex) =>
            selectedPatternId === pattern.id && (
              <div key={pattern.id} className="pad-pattern-wrapper">
                {pattern.instruments.map(
                  (instrument, instrumentIndex: number) => (
                    <div
                      className="instrument-wrapper"
                      key={instrument.id}
                      onClick={() => handleInstrumentSelect(instrument.id)}
                    >
                      <div
                        className="selected-audio-wrapper"
                        onDrop={(e) =>
                          handleDrop(e, patternIndex, instrumentIndex)
                        }
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <span>{`${
                          instrument.instrument.name ?? "악기 선택"
                        }`}</span>
                      </div>

                      {instrument?.isPiano ? (
                        <div
                          className="pad-piano-wrapper"
                          onClick={() => handleModal("PianoRoll", "open")}
                        >
                          {instrument.pianoSteps &&
                            instrument.pianoSteps.notes.map((note) => (
                              <div
                                key={`note.noteName${v1()}`}
                                style={{
                                  display: "flex",
                                  width: "100%",
                                  height: "2px",
                                  position: "relative",
                                }}
                              >
                                {note.noteValues.map((noteValue) => (
                                  <div
                                    key={v1()}
                                    style={{
                                      width: `${noteValue.width}px`,
                                      height: "2px",
                                      backgroundColor: "lime",
                                      position: "absolute",
                                      left: noteValue.x,
                                    }}
                                  ></div>
                                ))}
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="checkbox-wrapper">
                          {instrument.steps.map((step, stepIndex: number) => (
                            <div key={step.id} className="checkbox-content">
                              <input
                                className="checkbox-input"
                                id={step.id}
                                type="checkbox"
                                onChange={() =>
                                  handleCheck(
                                    patternIndex,
                                    instrumentIndex,
                                    stepIndex
                                  )
                                }
                                checked={step.isChecked}
                              />
                              <label htmlFor={step.id}></label>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="effector-plugin-wrapper">
                        <img
                          src={"icons/plugin.svg"}
                          width={15}
                          height={15}
                          alt="effector-plugin"
                        />

                        <select
                          name="padEffectorList"
                          onChange={(e) =>
                            handleEffector(Number(e.target.value))
                          }
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
                  )
                )}
              </div>
            )
        )}
        <div>
          <button onClick={addInstrument}>+ Add Instrument</button>
        </div>
      </article>
    </section>
  );
};

export default Pad;

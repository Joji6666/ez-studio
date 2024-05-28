import { useEffect } from "react";
import "./style/play_list.scss";
import usePlayList from "./store/usePlayList";
import type { ICheckedStep } from "./util/play_list_interface";
import type { IInstrument } from "../instrumentSelector/util/instrument_selector_interface";
import WaveVisualizer from "./WaveVisualizer";
import useInstrument from "../instrumentSelector/store/useInstrument";

const PlayList = () => {
  const {
    playListTracks,
    measureBarMaxWidth,
    scrollX,
    isDragging,
    measureWidth,
    measures,
    initPlayList,
    initMeasure,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleInstrumentDrop,
  } = usePlayList();

  const { loadedInstrument } = useInstrument();

  useEffect(() => {
    if (playListTracks.length > 0 && !isDragging) {
      const checkedSteps = document.querySelectorAll(".pattern-step");

      if (checkedSteps.length > 0) {
        const newCheckedSteps: ICheckedStep[] = [];
        checkedSteps.forEach((stepEl) => {
          const element = stepEl as HTMLElement;

          const {
            childPatternIndex,
            patternIndex,
            stepId,
            trackIndex,
            instrument,
          } = element.dataset;

          let newInstrument: IInstrument = {
            url: "",
            name: "",
            group: "",
          };

          if (instrument) {
            newInstrument = JSON.parse(instrument);
          }

          const newCheckedStepOption: ICheckedStep = {
            childPatternIndex,
            patternIndex,
            stepId,
            trackIndex,
            rect: element.getBoundingClientRect(),
            instrument: newInstrument,
          };

          newCheckedSteps.push(newCheckedStepOption);
        });

        usePlayList.setState({
          checkedSteps: newCheckedSteps,
        });
      }
    }
  }, [playListTracks]);

  useEffect(() => {
    initPlayList();
    initMeasure();
  }, []);

  return (
    <section className="play-list-section">
      <div className="timeline-bar-line"></div>
      <div className="play-list-top-wrapper">
        <div className="play-list-side-toolbar"></div>
        <div className="play-list-measure-bar-wrapper">
          <div
            className="play-list-measure-bar"
            style={{
              width: `${
                measureBarMaxWidth > measureWidth * 36
                  ? measureBarMaxWidth
                  : measureWidth * 36
              }px`,
            }}
          >
            {[...Array(measures)].map((_, index) => (
              <div
                key={index}
                className="measure"
                style={{
                  minWidth: `${measureWidth}px`,
                  maxWidth: `${measureWidth}px`,
                }}
              >
                <p style={{ width: "100%", height: "100%" }}>{index}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="play-list-track-list-wrapper">
        {playListTracks.map((playListTrack, trackIndex) => (
          <div
            className="play-list-track-content-wrapper"
            key={playListTrack.id}
          >
            <div className="play-list-track-content-title">
              {playListTrack.trackName !== ""
                ? playListTrack.trackName
                : "empty"}
            </div>

            <div
              className="play-list-track-content-pattern-wrapper-container"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onDrop={(e) => handleInstrumentDrop(e, trackIndex)}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="play-list-track-content-pattern-wrapper">
                <div
                  className="play-list-track-content-pattern-content-wrapper"
                  style={{ right: scrollX }}
                >
                  {playListTrack.patterns.map((pattern, patternIndex) => (
                    <div
                      id={`pattern-${pattern.id}`}
                      key={pattern.id}
                      className="play-list-track-content-pattern-content"
                      onMouseDown={(e) =>
                        handleMouseDown(e, playListTrack.id, pattern)
                      }
                      style={{
                        minWidth: playListTrack.instrument
                          ? "50px"
                          : pattern.pattern[0].steps.length * 7,
                        maxWidth: playListTrack.instrument
                          ? "50px"
                          : pattern.pattern[0].steps.length * 7,

                        left: `${pattern.x}px`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          position: "absolute",
                          height: "100%",
                        }}
                        className="grid"
                      >
                        {[...Array(measureWidth / 28)].map((_, index) => (
                          <div
                            key={index}
                            style={{
                              minWidth: `${28}px`,
                              maxWidth: `${28}px`,
                              borderRight: "1px solid black",
                              height: "100%",
                            }}
                          ></div>
                        ))}
                      </div>
                      {playListTrack.instrument &&
                        playListTrack.instrument?.url !== "" && (
                          <div
                            className="wave-visualizer"
                            data-track-id={playListTrack.id}
                            data-track-index={trackIndex}
                            data-pattern-index={patternIndex}
                            data-instrument={JSON.stringify(
                              playListTrack.instrument
                            )}
                          >
                            <WaveVisualizer
                              player={
                                loadedInstrument[playListTrack.instrument?.url]
                              }
                            />
                          </div>
                        )}
                      <div className="play-list-track-content-child-pattern-content-wrapper">
                        {pattern.pattern.map(
                          (childPattern, childPatternIndex) => (
                            <div
                              className="play-list-track-content-child-pattern-steps-wrapper"
                              key={childPattern.id}
                            >
                              {childPattern.steps.map((step) => (
                                <div key={step.id}>
                                  {step.isChecked ? (
                                    <div
                                      data-track-index={trackIndex}
                                      data-pattern-index={patternIndex}
                                      data-child-pattern-index={
                                        childPatternIndex
                                      }
                                      data-instrument={JSON.stringify(
                                        childPattern.instrument
                                      )}
                                      data-step-id={step.id}
                                      className="pattern-step"
                                    ></div>
                                  ) : (
                                    <p
                                      style={{
                                        backgroundColor: "white",
                                        width: "7px",
                                        height: "7px",
                                        visibility: "hidden",
                                      }}
                                    ></p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlayList;

import { useEffect, useState, useRef } from "react";
import "./style/play_list.scss";
import usePlayList from "./store/usePlayList";
import useTopToolbar from "../topToolbar.tsx/store/useTopToolbar";

const PlayList = () => {
  const {
    playListTracks,
    isPlayListPlaying,
    measureBarMaxWidth,
    scrollX,
    initPlayList,
    increaseStep,
    handleScroll,
  } = usePlayList();
  const { bpm, noteValue } = useTopToolbar();

  const measureBarRef = useRef(null);

  const [xPosition, setXPosition] = useState(0);
  const [measures, setMeasures] = useState(0);
  const [measureWidth, setMeasureWidth] = useState(0);

  const calculateMeasureWidth = (noteValue: string, baseWidth: number) => {
    const convertNoteValue = Number(noteValue.replace("n", ""));
    const widthPerStep = baseWidth * (convertNoteValue / 4);
    return widthPerStep * convertNoteValue; // 한 마디의 길이 계산
  };

  useEffect(() => {
    let interval = null;
    const convertNoteValue = Number(noteValue.replace("n", ""));
    const baseWidth = 7; // 각 스텝의 기준 이동 거리 (7px)

    const measureWidth = calculateMeasureWidth(noteValue, baseWidth);

    const numberOfMeasures = Math.ceil(
      measureBarMaxWidth > 1500
        ? measureBarMaxWidth
        : (measureWidth * 36) / measureWidth
    );

    setMeasureWidth(measureWidth);
    setMeasures(numberOfMeasures);

    if (isPlayListPlaying) {
      const stepDuration = (60 * 1000) / (bpm * (convertNoteValue / 4)); // 한 스텝의 지속 시간 계산
      const widthPerStep = baseWidth / (convertNoteValue / 4);
      interval = setInterval(() => {
        setXPosition((prevPosition) => prevPosition + +widthPerStep); // xPosition을 계속 증가
        increaseStep();
      }, stepDuration);
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlayListPlaying, bpm, noteValue]);

  useEffect(() => {
    const measureBarWrapper = document.querySelector(
      ".play-list-measure-bar-wrapper"
    );

    // Measure bar 스크롤 이벤트 리스너
    if (measureBarWrapper) {
      measureBarWrapper.addEventListener("scroll", function () {
        handleScroll(measureBarWrapper.scrollLeft);
      });
    }

    initPlayList();
  }, []);

  return (
    <section className="play-list-section">
      <div
        className="timeline-bar-line"
        style={{
          left: `calc(${xPosition}px + 10%)`,
        }}
      ></div>
      <div className="play-list-top-wrapper">
        <div className="play-list-side-toolbar"></div>
        <div className="play-list-measure-bar-wrapper">
          <div
            ref={measureBarRef}
            className="play-list-measure-bar"
            style={{
              width: `${
                measureBarMaxWidth > measureWidth * 36
                  ? measureBarMaxWidth
                  : measureWidth * 36
              }px`,
              display: "flex",
            }}
          >
            {[...Array(measures)].map((_, index) => (
              <div
                key={index}
                className="measure"
                style={{
                  minWidth: `${measureWidth}px`,
                  maxWidth: `${measureWidth}px`,
                  borderRight: "1px solid black",
                  height: "100%",
                }}
              >
                <p style={{ width: "100%", height: "100%" }}>{index}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="play-list-track-list-wrapper">
        {playListTracks.map((playListTrack) => (
          <div
            className="play-list-track-content-wrapper"
            key={playListTrack.id}
          >
            <div className="play-list-track-content-title">
              {playListTrack.trackName !== ""
                ? playListTrack.trackName
                : "empty"}
            </div>

            <div className="play-list-track-content-pattern-wrapper-container">
              <div className="play-list-track-content-pattern-wrapper">
                <div
                  className="play-list-track-content-pattern-content-wrapper"
                  style={{ right: scrollX }}
                >
                  {playListTrack.patterns.map((pattern) => (
                    <div
                      id={`pattern-${pattern.id}`}
                      key={pattern.id}
                      className="play-list-track-content-pattern-content"
                      style={{
                        minWidth: pattern.pattern[0].steps.length * 7,
                        maxWidth: pattern.pattern[0].steps.length * 7,
                        borderRight: "1px solid black",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {pattern.pattern.map((childPattern) => (
                          <div
                            key={childPattern.id}
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                            }}
                          >
                            {childPattern.steps.map((step) => (
                              <div key={step.id}>
                                {step.isChecked ? (
                                  <p
                                    style={{
                                      backgroundColor: "white",
                                      width: "7px",
                                      height: "7px",
                                    }}
                                  ></p>
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
                        ))}
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

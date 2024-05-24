import { useEffect, useState, useRef } from "react";
import * as Tone from "tone";
import "./style/play_list.scss";
import usePlayList from "./store/usePlayList";
import useTopToolbar from "../topToolbar.tsx/store/useTopToolbar";
import useInstrument from "../instrumentSelector/store/useInstrument";
import { IInstrument } from "../instrumentSelector/util/instrument_selector_interface";

let xPo = 0;

const PlayList = () => {
  const {
    playListTracks,
    isPlayListPlaying,
    measureBarMaxWidth,
    scrollX,
    initPlayList,
    handleScroll,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
  } = usePlayList();
  const { bpm, noteValue } = useTopToolbar();
  const { loadedInstrument } = useInstrument();

  const measureBarRef = useRef(null);
  const timelineBarRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [measures, setMeasures] = useState(0);
  const [measureWidth, setMeasureWidth] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState([]);

  const calculateMeasureWidth = (noteValue: string, baseWidth: number) => {
    const convertNoteValue = Number(noteValue.replace("n", ""));
    const widthPerStep = baseWidth * (convertNoteValue / 4);
    return widthPerStep * convertNoteValue; // 한 마디의 길이 계산
  };

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

  useEffect(() => {
    if (playListTracks.length > 0) {
      const checkedSteps = document.querySelectorAll(".pattern-step");

      if (checkedSteps.length > 0) {
        const newCheckedSteps = [];
        checkedSteps.forEach((stepEl) => {
          const element = stepEl as HTMLElement;
          const { childPatternIndex, patternIndex, stepId, trackIndex } =
            element.dataset;

          const newCheckedStepOption = {
            childPatternIndex,
            patternIndex,
            stepId,
            trackIndex,
            rect: element.getBoundingClientRect(),
          };

          newCheckedSteps.push(newCheckedStepOption);
        });

        setCheckedSteps(newCheckedSteps);
      }
    }
  }, [playListTracks]);

  useEffect(() => {
    if (isPlayListPlaying) {
      const checkedStepsRects = checkedSteps.map((step) => step.rect);

      const stepDuration = (60 * 1000) / bpm; // 한 스텝의 지속 시간 계산 (ms)
      const baseWidth = 7; // 각 스텝의 기준 이동 거리 (px)
      let lastTime = 0; // 마지막 프레임의 시간을 저장할 변수
      const playedStep = [];
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

              if (!playedStep.includes(step.stepId)) {
                const instrument =
                  loadedInstrument[
                    playListTracks[step.trackIndex].patterns[step.patternIndex]
                      .pattern[step.childPatternIndex].instrument.url
                  ];
                instrument.start();
              }
              playedStep.push(step.stepId);
            }
          });
        }
        animationFrameRef.current = requestAnimationFrame(render);
      };

      Tone.Transport.start();

      requestAnimationFrame(render);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      Tone.Transport.stop();
    }
  }, [isPlayListPlaying, bpm]);

  useEffect(() => {
    const measureWidth = calculateMeasureWidth(noteValue, 7);

    const numberOfMeasures = Math.ceil(
      measureBarMaxWidth > 1500
        ? measureBarMaxWidth
        : (measureWidth * 36) / measureWidth
    );

    setMeasureWidth(measureWidth);
    setMeasures(numberOfMeasures);
  }, [noteValue]);

  return (
    <section className="play-list-section">
      <div
        ref={timelineBarRef}
        className="timeline-bar-line"
        // style={{
        //   left: `calc(${xPosition}px + 10%)`,
        // }}
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
                        minWidth: pattern.pattern[0].steps.length * 7,
                        maxWidth: pattern.pattern[0].steps.length * 7,

                        left: `${pattern.x}px`,
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
                        {pattern.pattern.map(
                          (childPattern, childPatternIndex) => (
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
                                      data-track-index={trackIndex}
                                      data-pattern-index={patternIndex}
                                      data-child-pattern-index={
                                        childPatternIndex
                                      }
                                      data-step-id={step.id}
                                      style={{
                                        backgroundColor: "white",
                                        width: "7px",
                                        height: "7px",
                                      }}
                                      className="pattern-step"
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

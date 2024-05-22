import { useEffect, useState } from "react";
import "./style/play_list.scss";
import usePlayList from "./store/usePlayList";
import useTopToolbar from "../topToolbar.tsx/store/useTopToolbar";

const PlayList = () => {
  const { playListTracks, isPlayListPlaying, increaseStep } = usePlayList();
  const { bpm } = useTopToolbar();
  const [maxWidth, setMaxWidth] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [xPosition, setXPosition] = useState(0);
  useEffect(() => {
    // Calculate the maximum width

    let maxPatternWidth = 0;
    playListTracks.forEach((playListTrack) => {
      playListTrack.patterns.forEach((pattern) => {
        const patternWidth =
          pattern.pattern[0].steps.length * 7 * playListTrack.patterns.length;
        if (patternWidth > maxPatternWidth) {
          maxPatternWidth = patternWidth;
        }
      });
    });
    setMaxWidth(maxPatternWidth + 1000);
  }, [playListTracks]);

  useEffect(() => {
    const measureBarWrapper = document.querySelector(
      ".play-list-measure-bar-wrapper"
    );

    // Measure bar 스크롤 이벤트 리스너
    if (measureBarWrapper) {
      measureBarWrapper.addEventListener("scroll", function () {
        setScrollX(measureBarWrapper.scrollLeft);
      });
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (isPlayListPlaying) {
      const stepDuration = (60 / bpm) * 1000;
      interval = setInterval(() => {
        setXPosition((prevPosition) => (prevPosition + 1) % 200);
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
  }, [isPlayListPlaying, bpm]);

  return (
    <section className="play-list-section">
      <div
        className="timeline-bar-line"
        style={{
          left: `calc(${xPosition * 7}px + 10%)`,
        }}
      ></div>
      <div className="play-list-top-wrapper">
        <div className="play-list-side-toolbar"></div>
        <div className="play-list-measure-bar-wrapper">
          <div
            className="play-list-measure-bar"
            style={{
              width: `${maxWidth}px`,
            }}
          ></div>
        </div>
      </div>
      <div className="play-list-track-list-wrapper">
        {playListTracks.map((playListTrack) => (
          <div
            className="play-list-track-content-wrapper"
            key={playListTrack.id}
          >
            <div className="play-list-track-content-title">
              {playListTrack.trackName}
            </div>

            <div className="play-list-track-content-pattern-wrapper-container">
              <div className="play-list-track-content-pattern-wrapper">
                <div
                  className="play-list-track-content-pattern-content-wrapper"
                  style={{ right: scrollX }}
                >
                  {playListTrack.patterns.map((pattern) => (
                    <div
                      key={pattern.id}
                      className="play-list-track-content-pattern-content"
                      style={{
                        minWidth: pattern.pattern[0].steps.length * 7,
                        maxWidth: pattern.pattern[0].steps.length * 7,
                      }}
                    ></div>
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

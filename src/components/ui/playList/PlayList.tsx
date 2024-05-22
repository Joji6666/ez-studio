import { useEffect, useState } from "react";
import "./style/play_list.scss";
import usePlayList from "./store/usePlayList";

const PlayList = () => {
  const { playListTracks } = usePlayList();
  const [maxWidth, setMaxWidth] = useState(0);
  const [scrollX, setScrollX] = useState(0);
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

  return (
    <section className="play-list-section">
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

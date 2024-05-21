import "./style/play_list.scss";
import usePlayList from "./store/usePlayList";
import useTopToolbar from "../topToolbar.tsx/store/useTopToolbar";
import { useEffect, useRef, useState } from "react";
const PlayList = () => {
  const {
    playListTracks,
    isPlayListPlaying,
    trackListWrapperScrollHeight,
    increaseStep,
  } = usePlayList();
  const { bpm } = useTopToolbar();
  const [xPosition, setXPosition] = useState(0);
  const trackWrapperRef = useRef<HTMLDivElement | null>(null);

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

  //   useEffect(() => {
  //     if (trackWrapperRef.current) {
  //       const trackListWrapper = document.querySelector(".track-list-wrapper");

  //       if (trackListWrapper) {
  //         if (trackWrapperRef.current) {
  //           trackWrapperRef.current.style.height = `${trackListWrapper.scrollHeight}px`;
  //         }
  //       }
  //     }
  //   }, [playListTracks]);

  // 49.4

  return (
    <section className="play-list-section">
      <article className="play-list-article">
        <div className="timeline-wrapper">
          <div className="timeline-toolbar">toolbar</div>
          <div className="timeline-bar-wrapper">
            <div
              className="timeline-bar"
              style={{
                left: `calc(${xPosition * 7}px)`,
              }}
            >
              {/* <div className="timeline-bar-triangle"></div> */}
              <div className="timeline-bar-line"></div>
            </div>
          </div>
        </div>

        <div className="play-list-wrapper">
          <div className="track-list-wrapper">
            {playListTracks.map((playListTrack) => (
              <div
                className="track-title-wrapper"
                key={playListTrack.trackName}
              >
                <span>{playListTrack.trackName}</span>
              </div>
            ))}
          </div>
          <div
            className="track-wrapper"
            ref={trackWrapperRef}
            style={{
              height:
                trackListWrapperScrollHeight > 0
                  ? `${trackListWrapperScrollHeight + 60}px`
                  : "100%",
            }}
          >
            {playListTracks.map((playListTrack) => (
              <div className="track-contents-wrapper" key={playListTrack.id}>
                {playListTrack.patterns.map((pattern) => (
                  <div
                    key={pattern.id}
                    className="track-contents-pattern-wrapper"
                    style={{
                      minWidth: pattern.pattern[0].steps.length * 7,
                      maxWidth: pattern.pattern[0].steps.length * 7,
                    }}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
};

export default PlayList;

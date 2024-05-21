import "./style/play_list.scss";
import usePlayList from "./store/usePlayList";
import useTopToolbar from "../topToolbar.tsx/store/useTopToolbar";
import { useEffect, useState } from "react";
const PlayList = () => {
  const {
    playListTracks,
    isPlayListPlaying,
    playListSectionScrollHeight,
    increaseStep,
  } = usePlayList();
  const { bpm } = useTopToolbar();
  const [xPosition, setXPosition] = useState(0);

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
          <div
            className="track-list-wrapper"
            style={{
              height:
                playListSectionScrollHeight > 0
                  ? `${playListSectionScrollHeight + 60}px`
                  : "100%",
            }}
          >
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
            style={{
              height:
                playListSectionScrollHeight > 0
                  ? `${playListSectionScrollHeight + 10}px`
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

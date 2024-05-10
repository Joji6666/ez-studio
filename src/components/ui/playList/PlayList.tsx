import React, { useEffect } from "react";
import "./style/play_list.scss";
import usePlayList from "./store/usePlayList";
const PlayList = () => {
  const { playListTracks, initPlayList } = usePlayList();

  useEffect(() => {
    initPlayList();
  }, []);

  return (
    <section className="play-list-section">
      <div className="timeline-bar">
        <div>bar</div>
      </div>
      <div className="play-list-wrapper">
        {playListTracks.map((playListTrack) => (
          <div className="track-wrapper" key={playListTrack.id}>
            <label className="track-title-wrapper">
              {playListTrack.trackName}
            </label>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlayList;

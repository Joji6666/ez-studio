import "./style/play_list.scss";
import usePlayList from "./store/usePlayList";
const PlayList = () => {
  const { playListTracks } = usePlayList();

  return (
    <section className="play-list-section">
      <div className="timeline-bar">
        <div>bar</div>
      </div>
      <div className="play-list-wrapper">
        {playListTracks.map((playListTrack) => (
          <div className="track-wrapper" key={playListTrack.id}>
            <div className="track-title-wrapper">
              <span>{playListTrack.trackName}</span>
            </div>

            <div className="track-contents-wrapper">
              {playListTrack.patterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className="track-contents-pattern-wrapper"
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlayList;

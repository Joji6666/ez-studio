import { useEffect, useState } from "react";
import usePlayList from "../../../../playList/store/usePlayList";
import "./style/piano_roll.scss";

const generateNotes = () => {
  const notes: string[] = [];
  const pitches: string[] = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  for (let octave = 0; octave <= 10; octave++) {
    for (const pitch of pitches) {
      notes.push(`${pitch}${octave}`);
    }
  }
  return notes;
};

const notes = generateNotes().reverse();

const PianoRoll = () => {
  const [scrollX, setScrollX] = useState(0);

  const { measureWidth, measures, measureBarMaxWidth } = usePlayList();

  useEffect(() => {
    const pianoRollMeasureBarWrapper = document.querySelector(
      ".piano-roll-measure-bar-wrapper"
    );

    if (pianoRollMeasureBarWrapper) {
      pianoRollMeasureBarWrapper.addEventListener("scroll", () => {
        setScrollX(pianoRollMeasureBarWrapper.scrollLeft);
      });
    }
  }, []);

  return (
    <div className="piano-roll-container">
      <div className="piano-roll-top-wrapper">
        <div className="piano-roll-toolbar"></div>
        <div className="piano-roll-measure-bar-wrapper">
          <div
            className="piano-roll-measure-bar"
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
                  borderRight: "1px solid black",
                }}
              >
                <p style={{ width: "100%", height: "100%" }}>{index}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="piano-roll-contents-wrapper">
        <div className="piano-roll-note-wrapper">
          {notes.map((note) => (
            <div
              key={note}
              style={{
                color: `${note.includes("#") ? "white" : "black"}`,
                width: "100%",
                height: "20px",
                borderRight: `1px solid black`,
                display: "flex",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  height: "100%",
                  width: `100%`,
                  backgroundColor: `${note.includes("#") ? "black" : "white"}`,
                  borderTop: `${
                    note.includes("E") || note.includes("B")
                      ? "1px solid black"
                      : "none"
                  }`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: `${note.includes("#") ? "start" : "end"}`,
                }}
              >
                {note}
              </p>
              {note.includes("#") && (
                <div
                  style={{
                    width: "50%",
                    height: "100%",
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      height: "1px",
                      width: "100%",
                      backgroundColor: "black",
                    }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="piano-roll-step-wrapper" style={{ right: scrollX }}>
          {[...Array(measures)].map((_, index) => (
            <div
              key={index}
              className="measure"
              style={{
                minWidth: `${measureWidth}px`,
                maxWidth: `${measureWidth}px`,
              }}
            >
              {notes.map((note) => (
                <div
                  style={{
                    backgroundColor: "darkgray",
                    width: "100%",
                    height: "20px",
                    borderBottom: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                >
                  {note}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PianoRoll;

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

const notes = generateNotes();

const PianoRoll = () => {
  return (
    <div className="piano-roll-container">
      <div className="piano-roll-note-wrapper">
        {notes.map((note) => (
          <div
            key={note}
            style={{
              backgroundColor: `${note.includes("#") ? "black" : "white"}`,
              color: `${note.includes("#") ? "white" : "black"}`,
              width: `${note.includes("#") ? "45px" : "60px"}`,
              height: "20px",
            }}
          >
            {note}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PianoRoll;

import * as Tone from "tone";
import { create } from "zustand";
import { ITopToolbar } from "../util/top_toolbar_interface";
import usePlayList from "../../playList/store/usePlayList";
import usePad from "../../pad/store/usePad";
import useEffectorController from "../../shared/modal/components/effector/store/useEffectorController";
import useAuth from "../../../views/login/store/useAuth";
import axios from "axios";

const useTopToolbar = create<ITopToolbar>((set) => ({
  bpm: 120,
  analyzer: null,
  noteValue: "16n",
  handleBpm: (e: React.ChangeEvent<HTMLInputElement>) => {
    Tone.Transport.bpm.value = Number(e.target.value);

    set(() => ({ bpm: Number(e.target.value) }));
  },
  handleNoteValue: (e: React.ChangeEvent<HTMLSelectElement>) => {
    const measureBarMaxWidth = usePlayList.getState().measureBarMaxWidth;
    const calculateMeasureWidth = usePlayList.getState().calculateMeasureWidth;
    const measureWidth = calculateMeasureWidth(e.target.value, 7);

    const numberOfMeasures = Math.ceil(
      measureBarMaxWidth > 1500
        ? measureBarMaxWidth
        : (measureWidth * 36) / measureWidth
    );

    usePlayList.setState({
      measureWidth,
      measures: numberOfMeasures,
    });

    set(() => ({
      noteValue: e.target.value,
    }));
  },
  handleSave: async () => {
    const patterns = usePad.getState().patterns;
    const playListTracks = usePlayList.getState().playListTracks;
    const effectorList = useEffectorController.getState().effectorList;
    const loginInfo = useAuth.getState().loginInfo;

    const params = {
      projectData: JSON.stringify({
        patterns,
        playListTracks,
        effectorList,
      }),
      projectName: "test1",
      // projectData: {
      //   patterns,
      //   playListTracks,
      //   effectorList,
      // },

      fkUserId: loginInfo.id,
    };

    console.log(params, "params@");

    // {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // }
    const res = await axios.post("http://localhost:8333/api/project", params);

    if (res) {
      console.log(res, "save Res!");
    }
  },
}));

export default useTopToolbar;

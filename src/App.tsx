import { Route, Routes } from "react-router-dom";
import Main from "./components/views/main/Main";
import Studio from "./components/views/studio/Studio";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/studio" element={<Studio />} />
      </Routes>
    </>
  );
}

export default App;

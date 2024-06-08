import { Route, Routes } from "react-router-dom";
import Main from "./components/views/main/Main";
import Studio from "./components/views/studio/Studio";
import Login from "./components/views/login/Login";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/studio" element={<Studio />} />
      </Routes>
    </>
  );
}

export default App;

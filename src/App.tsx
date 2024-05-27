import { Route, Routes } from "react-router-dom";
import Main from "./components/main/Main";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </>
  );
}

export default App;

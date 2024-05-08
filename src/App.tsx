import { Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./components/Main";

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

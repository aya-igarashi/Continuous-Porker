import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PokerGame from "./Component/Pokergame/PokerGame";
import "./App.css";
import Navber from "./Nav/Navber";
import Home from "./Component/Home/Home";

function App() {
  return (
    <div>
      <Router>
        <Navber />
        {/* ページルーティング */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/poker-game" element={<PokerGame />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

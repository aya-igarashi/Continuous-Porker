import React from "react";
import { Link } from "react-router-dom";
import "./Navber.css";

function Navber() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">ホーム</Link>
        </li>
        <li>
          <Link to="/poker-game">ポーカーゲーム</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navber;

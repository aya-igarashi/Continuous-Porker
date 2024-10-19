import React from "react";
import "./CardTable.css";

const suits = ["♠", "♥", "♦", "♣"];
const values = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

// CardTableコンポーネント
const CardTable = ({ usedCards }) => {
  // カードのチェック済み状態を確認
  const isCardUsed = (card) => usedCards.includes(card);

  return (
    <div className="card-table">
      {suits.map((suit) => (
        <div key={suit}>
          {/* <h3>{suit}</h3> */}
          <div className="card-row">
            {values.map((value) => {
              const card = `${value}${suit}`;
              return (
                <div
                  key={card}
                  className={`card-cell ${isCardUsed(card) ? "used-card" : ""}`}
                >
                  {card}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardTable;

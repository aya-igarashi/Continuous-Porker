import React, { useState, useEffect } from "react";
import "./PokerGame.css";
import CardTable from "./CardTable"; // ここに新しいCardTableコンポーネントをインポート

// カードのスートと値の定義
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

// シャッフル関数
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ストレート判定
function checkStraight(values) {
  const cardOrder = [
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

  // 枚数が4枚以下ならfalse
  if (values.length < 5) return false;

  // カードの数値をインデックスに変換
  let sortedValues = values
    .map((value) => cardOrder.indexOf(value))
    .sort((a, b) => a - b);

  // 通常のストレート判定
  let isStraight = true;
  for (let i = 1; i < sortedValues.length; i++) {
    if (sortedValues[i] !== sortedValues[i - 1] + 1) {
      isStraight = false;
      break;
    }
  }

  // 循環ストレートのパターンをチェック
  const circularStraights = [
    [0, 1, 2, 3, 12], // KA234
    [0, 1, 2, 11, 12], // QKA23
    [0, 1, 10, 11, 12], // JQKA2
    [0, 9, 10, 11, 12], // 10JQKA
  ];

  // 循環ストレートをチェック
  const isCircularStraight = circularStraights.some(
    (pattern) =>
      pattern.length === sortedValues.length &&
      pattern.every((val, index) => val === sortedValues[index])
  );

  // 通常のストレートか循環ストレートのどちらかが true ならストレートとみなす
  return isStraight || isCircularStraight;
}

// ロイヤルストレート判定
function checkRoyalStraight(values) {
  const royalValues = ["10", "J", "Q", "K", "A"];
  return royalValues.every((value) => values.includes(value));
}

function PokerGame() {
  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedHand, setSelectedHand] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false); // ゲームオーバーの状態を管理
  const [isSelectingDisabled, setIsSelectingDisabled] = useState(false); // クリック無効状態を管理
  const [usedCards, setUsedCards] = useState([]); // 使用済みカードを追跡

  // selectedHand が変更されたときに自動的に5枚の判定を行う
  useEffect(() => {
    if (selectedHand.length === 5) {
      setTimeout(() => checkHand(), 100);
    }
  }, [selectedHand]); // selectedHand が変更されるたびに実行

  // ゲームの初期化
  const initializeDeck = () => {
    let newDeck = [];
    for (let suit of suits) {
      for (let value of values) {
        newDeck.push(`${value}${suit}`);
      }
    }
    setDeck(shuffle(newDeck));
    setHand([]);
    setSelectedHand([]);
    setUsedCards([]); // 使用済みカードリセット
    setIsGameOver(false); // ゲームオーバーをリセット
  };

  // ゲームのスタート
  const start = () => {
    initializeDeck(); // デッキを初期化
    dealFlop();
  };

  // 最初の5枚を取得
  const dealFlop = () => {
    if (isGameOver) return; // ゲームオーバーなら処理しない
    const flop = deck.slice(0, 5);
    setHand((prevHand) => [...prevHand, ...flop]);
    setDeck((prevDeck) => prevDeck.slice(5));
    setUsedCards((prevUsed) => [...prevUsed, ...flop]);
  };

  // カードを1枚ずつ引く
  const drawCard = () => {
    if (deck.length < 1 || isGameOver) return;
    const newCard = deck[0]; // デッキの最初の1枚を取得
    setHand((prevHand) => [...prevHand, newCard]); // 手札に新しいカードを追加
    setDeck((prevDeck) => prevDeck.slice(1)); // デッキからそのカードを削除
    setUsedCards((prevUsed) => [...prevUsed, newCard]);
  };

  // カードを選択する
  const selectCard = (index) => {
    if (selectedHand.length > 4 || isGameOver) return;
    setIsSelectingDisabled(true); // クリックを無効にする
    const card = hand[index];
    setSelectedHand([...selectedHand, card]);
    const newHand = hand.filter((_, i) => i !== index);
    setHand(newHand);
    drawCard();

    // 1秒後に選択を有効化
    setTimeout(() => {
      setIsSelectingDisabled(false);
    }, 1000);
  };

  // 役の判定とクリア判定
  const checkHand = () => {
    if (isGameOver) return;

    const handValues = selectedHand.map((card) => card.slice(0, -1));
    const handSuits = selectedHand.map((card) => card.slice(-1));

    const valueCounts = {};
    handValues.forEach((value) => {
      valueCounts[value] = (valueCounts[value] || 0) + 1;
    });

    const counts = Object.values(valueCounts);
    const maxCount = Math.max(...counts);
    const uniqueValues = Object.keys(valueCounts);
    const isFlush = handSuits.length > 4 && new Set(handSuits).size === 1;
    const isStraight = checkStraight(uniqueValues);
    const isRoyal = checkRoyalStraight(uniqueValues);

    let points = 0;
    let handType = "";

    // ロイヤルストレートフラッシュ
    if (isRoyal && isFlush) {
      points = 25;
      handType = "ロイヤルストレートフラッシュ";
    }
    // ストレートフラッシュ
    else if (isFlush && isStraight) {
      points = 15;
      handType = "ストレートフラッシュ";
    }
    // フォーカード
    else if (maxCount === 4) {
      points = 12;
      handType = "フォーカード";
    }
    // フルハウス
    else if (maxCount === 3 && counts.includes(2)) {
      points = 10;
      handType = "フルハウス";
    }
    // フラッシュ
    else if (isFlush) {
      points = 8;
      handType = "フラッシュ";
    }
    // ストレート
    else if (isStraight) {
      points = 5;
      handType = "ストレート";
    }
    // スリーカード
    else if (maxCount === 3) {
      points = 6;
      handType = "スリーカード";
    }
    // ツーペア
    else if (counts.filter((count) => count === 2).length === 2) {
      points = 2;
      handType = "ツーペア";
    }
    // KKかAAのワンペア
    else if (maxCount === 2) {
      const pairValue = uniqueValues.find((value) => valueCounts[value] === 2);
      if (pairValue === "K" || pairValue === "A") {
        points = 1;
        handType = "KKかAAのワンペア";
      }
    }

    setScore(score + points);

    if (points > 0) {
      alert(`${handType}成立！ ${points}ポイント獲得！`);
      setSelectedHand([]);

      // デッキが空の場合クリア
      if (deck.length === 0) {
        alert("クリアしました！次のラウンドに進みます！");
        initializeDeck(); // 新しいデッキを組み直す
      }
    } else {
      alert("game over!");
      setIsGameOver(true); // ゲームオーバーに設定
    }
  };

  return (
    <div className="pokerbox">
      <h1>ポーカーゲーム</h1>
      <div>
        <CardTable usedCards={usedCards} />
      </div>
      <div>
        {/* ゲームオーバー時はボタンを無効化 */}
        {isGameOver ? (
          <button onClick={start}>reset</button>
        ) : (
          <button onClick={start} disabled={isGameOver}>
            start
          </button>
        )}
        <button onClick={checkHand} disabled={isGameOver}>
          deal
        </button>
      </div>
      <div>
        <h2>手札</h2>
        <div id="draw-cards">
          {hand.map((card, index) => (
            <div
              key={index}
              className="card"
              onClick={() => selectCard(index)}
              style={{
                display: "inline-block",
                margin: "10px",
                cursor:
                  isGameOver || isSelectingDisabled ? "not-allowed" : "pointer",
              }}
            >
              {card}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2>選択したカード</h2>
        <div id="hand-cards">
          {selectedHand.map((card, index) => (
            <div
              key={index}
              className="card"
              style={{ display: "inline-block", margin: "10px" }}
            >
              {card}
            </div>
          ))}
        </div>
      </div>
      <h3>スコア: {score}</h3>
      <h4>残りカード数: {deck.length}</h4>
      {/* CardTableコンポーネントを表示 */}
    </div>
  );
}

export default PokerGame;

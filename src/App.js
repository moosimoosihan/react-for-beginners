import Button from "./Button";
import styles from "./App.module.css";
import {useEffect, useState} from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [amount, setAmount] = useState(0);

  function onChange(event) {
    setAmount(event.target.value);
  }

  function reset() {
    setAmount(0);
  }

  useEffect(() => {
    fetch("https://api.coinpaprika.com/v1/tickers")
      .then((response) => response.json())
      .then((json) => {
        setCoins(json);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedCoin && amount) {
      const price = parseFloat(selectedCoin.quotes.USD.price);
      const btcAmount = (amount / price).toFixed(8);
      document.getElementById("BTC").value = btcAmount;
    } else {
      document.getElementById("BTC").value = "";
    }
  }, [selectedCoin, amount]);

  function onSelectCoin(event) {
    const coinId = event.target.value;
    const coin = coins.find((coin) => coin.id === coinId);
    setSelectedCoin(coin);
  }

  return (
    <div>
      <h1>
        The Coins! {loading ? "" : `(${coins.length})`}
      </h1>
      {loading ? (
        <strong>Loading...</strong>
      ) : (
        <select onChange={onSelectCoin}>
          <option value="">Select a coin</option>
          {coins.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name} ({coin.symbol}) : {coin.quotes.USD.price} USD
            </option>
          ))}
        </select>
      )}
      <div>
        <div>
          <label htmlFor="USD">USD</label>
          <input
            value={amount}
            id="USD"
            placeholder="USD"
            type="number"
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="BTC">BTC</label>
          <input
            id="BTC"
            placeholder="BTC"
            type="number"
            disabled={true}
          />
        </div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}

export default App;

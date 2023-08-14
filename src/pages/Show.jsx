import React from 'react'
import showStore from '../stores/showStore'
import { useParams } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '../components/Header';


export default function Show() {
  const store = showStore();
  const params = useParams();
  const purchaseHistoryKey = `purchase_${store.data?.symbol}`;

  const [purchaseAmount, setPurchaseAmount] = React.useState(0);
  const [sellAmount, setSellAmount] = React.useState(0);
  const [cryptoHoldings, setCryptoHoldings] = React.useState(0);
  const [showPurchaseConfirmation, setShowPurchaseConfirmation] = React.useState(false);
  const [showSellConfirmation, setShowSellConfirmation] = React.useState(false);

  //Fetch data for the specific coin based on the route parameter
  React.useEffect(() => {
    store.fetchData(params.id);
    return () => {
      store.reset();
    };
  }, [params.id]);

  React.useEffect(() => {
    const storedPurchaseHistory = localStorage.getItem(purchaseHistoryKey);
    const initialPurchaseHistory = storedPurchaseHistory ? JSON.parse(storedPurchaseHistory) : [];

    // Calculate total crypto holdings based on purchase history
    const totalCryptoHoldings = initialPurchaseHistory.reduce((total, purchase) => {
      return total + parseFloat(purchase.amount);
    }, 0);

    setCryptoHoldings(totalCryptoHoldings);
  }, [purchaseHistoryKey]);

  const handlePurchase = (e) => {
    e.preventDefault();
    setShowPurchaseConfirmation(true);
  };

  const handleSell = (e) => {
    e.preventDefault();
    setShowSellConfirmation(true);
  };

  const confirmPurchase = () => {
    const totalCost = purchaseAmount * store.data.market_data.current_price.usd;
    setCryptoHoldings(cryptoHoldings + parseFloat(purchaseAmount));

    const newPurchase = {
      amount: purchaseAmount,
      totalCost,
      timestamp: new Date().toISOString(),
    };
    const storedPurchaseHistory = localStorage.getItem(purchaseHistoryKey);
    const updatedPurchaseHistory = storedPurchaseHistory ? JSON.parse(storedPurchaseHistory) : [];
    updatedPurchaseHistory.push(newPurchase);
    localStorage.setItem(purchaseHistoryKey, JSON.stringify(updatedPurchaseHistory));

    setPurchaseAmount(0);
    setShowPurchaseConfirmation(false);
  };

  const confirmSell = () => {
    const sellValue = sellAmount * store.data.market_data.current_price.usd;
    setCryptoHoldings(cryptoHoldings - parseFloat(sellAmount));

    const newSale = {
      amount: -sellAmount,
      totalValue: sellValue,
      timestamp: new Date().toISOString(),
    };
    const storedPurchaseHistory = localStorage.getItem(purchaseHistoryKey);
    const updatedPurchaseHistory = storedPurchaseHistory ? JSON.parse(storedPurchaseHistory) : [];
    updatedPurchaseHistory.push(newSale);
    localStorage.setItem(purchaseHistoryKey, JSON.stringify(updatedPurchaseHistory));

    setSellAmount(0);
    setShowSellConfirmation(false);
  };

  const cancelAction = () => {
    setShowPurchaseConfirmation(false);
    setShowSellConfirmation(false);
  };

  return (
    <div>

      {/* Display the header with a back button */}
      <Header back />

      {/* Render only when data is available */}
      {store.data && <>

      {/* Display coin image, name, and symbol */}
        <header className='show-header'>
            <img src ={store.data.image.large} />
            <h2>
              {store.data.name} ({store.data.symbol})
            </h2>
        </header>

        {/* Container for the AreaChart */}
        <div className='width'>
          <div className='show-graph'>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                width={500}
                height={400}
                data={store.graphData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="Price" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Display coin details */}
        <div className='show-details'>
          <div className='width'>
            <h2>Details</h2>

            <div className='show-details-row'>
              <h3>Market cap rank</h3>
              <span>{store.data.market_cap_rank}</span>
            </div>
            <div className='show-details-row'>
              <h3>24h high</h3>
              <span>${store.data.market_data.high_24h.usd}</span>
            </div>
            <div className='show-details-row'>
              <h3>24h low</h3>
              <span>${store.data.market_data.low_24h.usd}</span>
            </div>
            <div className='show-details-row'>
              <h3>Circulating supply</h3>
              <span>${store.data.market_data.circulating_supply}</span>
            </div>
            <div className='show-details-row'>
              <h3>Current price</h3>
              <span>${store.data.market_data.current_price.usd}</span>
            </div>
            <div className='show-details-row'>
              <h3>1y change</h3>
              <span>
                {store.data.market_data.price_change_percentage_1y.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Display info for buying, selling, and crypto holdings. */}
        <div className='width'>
          <div className='crypto-holdings'>
            <h2>Crypto Holdings</h2>
            <p>
              You currently own: {cryptoHoldings} {store.data.symbol} (Value: ${(
                cryptoHoldings * store.data.market_data.current_price.usd
              ).toFixed(2)})
            </p>
          </div>
        </div>
        <div className='width'>
          <div className='purchase-sell'>
            <div className='purchase-form'>
              <h2>Purchase Crypto</h2>
              <form onSubmit={handlePurchase}>
                <label htmlFor="purchaseAmount">Amount to Buy:</label>
                <input
                  type="number"
                  id="purchaseAmount"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  step="0.01"
                  min="0"
                  required
                />
                <button className='buy' type="submit">Purchase</button>
              </form>
            </div>

            <div className='sell-form'>
              <h2>Sell Crypto</h2>
              <form onSubmit={handleSell}>
                <label htmlFor="sellAmount">Amount to Sell:</label>
                <input
                  type="number"
                  id="sellAmount"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                  step="0.01"
                  min="0"
                  required
                />
                <button className='sell' type="submit">Sell</button>
              </form>
            </div>
            
          </div>
        </div>
        <div className='width'>
          {/* Purchase confirmation popup */}
          {showPurchaseConfirmation && (
            <div className="confirmation-popup">
              <p>
                Are you sure you want to purchase {purchaseAmount} {store.data.symbol} for ${purchaseAmount * store.data.market_data.current_price.usd}?
              </p>
              <button className='buy' onClick={confirmPurchase}>Confirm</button>
              <button className= 'buy' onClick={cancelAction}>Cancel</button>
            </div>
          )}
          {/* Sell confirmation popup */}
          {showSellConfirmation && (
            <div className="confirmation-popup">
              <p>
                Are you sure you want to sell {sellAmount} {store.data.symbol} for ${sellAmount * store.data.market_data.current_price.usd}?
              </p>
              <button className='sell' onClick={confirmSell}>Confirm</button>
              <button className='sell' onClick={cancelAction}>Cancel</button>
            </div>
          )}
          
        </div>
          
      </>}
    </div>
    
  );
}

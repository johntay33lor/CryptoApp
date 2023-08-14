// This component represents a list item for displaying cryptocurrency information.
// It uses React and React Router to render the information in a structured manner.
import React from 'react';
import { Link } from 'react-router-dom';

// The ListItem component accepts a "coin" object as a prop.
export default function ListItem({ coin }) {
  return (
    <div className="home-crypto">
      {/* Wrap the entire item in a link that directs to a specific route */}
      <Link to={`/${coin.id}`}>
        {/* Display the cryptocurrency image */}
        <span className='home-crypto-image'>
          <img src={coin.image} alt={`${coin.name} logo`} />
        </span>
        {/* Display the cryptocurrency name */}
        <span className='home-crypto-name'>{coin.name}</span>

        {/* Conditionally display the cryptocurrency prices */}
        {coin.priceBtc &&	
          <span className='home-crypto-prices'>
            {/* Display the price in BTC */}
            <span className='home-crypto-btc'>
              <img src="/bitcoin.webp" alt="Bitcoin logo" />
              {coin.priceBtc} BTC
            </span>
            {/* Display the price in USD */}
            <span className='home-crypto-usd'>({coin.priceUsd} USD)</span>
          </span>
        }
      </Link>
    </div>
  );
}

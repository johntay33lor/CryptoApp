// This component represents the header of a React application.
// It displays the site title and, optionally, a back button.
import React from 'react';
import { Link } from 'react-router-dom';

// The Header component receives a prop 'back' to determine whether to display a back button.
export default function Header({ back }) {
  return (
    <header className='header'>
      <div className='width'>
        {/* Render the back button if the 'back' prop is truthy */}
        {back && (
          <Link to="/">
            {/* SVG icon for the back button */}
            <svg xmlns="http://www.w3.org/2000/svg"
              viewBox='0 0 48 48'
              width="24">
              <path fill='currentColor'
                d="M20 44 0 24 20 4l2.8 2.85L5.65 24 22.8 41.15Z" />
            </svg>
          </Link>
        )}
        {/* Display the site title */}
        <h1><Link to="/">Wall Street Devs!</Link></h1>
      </div>
    </header>
  );
}

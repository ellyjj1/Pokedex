import React from 'react';
import bg from '../assets/logo.svg'; 
import { Link } from 'react-router-dom';


const Banner = () => {
  return (
    <Link to={`/`} >   
    <div 
      className="relative flex items-center justify-center h-48 mb-4"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
    >
    </div>
    </Link>
  );
}

export default Banner;

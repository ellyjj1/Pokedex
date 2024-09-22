import React from 'react';
import { Link } from 'react-router-dom';

const getTypeColor = (type) => {
  switch (type.toLowerCase()) {
    case 'grass':
      return 'bg-green-500';
    case 'poison':
      return 'bg-purple-500';
    case 'fire':
      return 'bg-red-500';
    case 'water':
      return 'bg-blue-500';
    case 'electric':
      return 'bg-yellow-500';
    case 'bug':
      return 'bg-green-300';
    case 'flying':
      return 'bg-blue-300';
    case 'ground':
      return 'bg-yellow-300';
    case 'fairy':
      return 'bg-pink-300';
    default:
      return 'bg-stone-400';
  }
};


const PokemonCard = ({ pokemon }) => {
  return (
    <Link to={`/pokemon/${pokemon.id}`} className="details-link">
      <div className="flex flex-col border shadow-md rounded-xl p-4 text-center m-2 w-64 bg-gray-200 items-center justify-center">
        <p className="text-gray-400">#{pokemon.id.toString().padStart(4, '0')}</p>
        <h3 className="text-lg font-bold text-gray-800">
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </h3>
        <img
          className="rounded-t-xl w-40 h-40 mt-4"
          src={pokemon.image}
          alt={pokemon.name}
          loading="lazy" 
        />
        <div className="mt-2 flex justify-center space-x-2 p-4">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className={`inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium text-white font-semibold ${getTypeColor(
                type
              )}`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          ))}
        </div>
        <div className="mt-2 flex justify-center space-x-2">
          <p className="bg-gray-400 inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium text-white font-semibold">
            Height: {pokemon.height}ft
          </p>
          <p className="bg-gray-400 inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium text-white font-semibold">
            Weight: {pokemon.weight}lbs
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PokemonCard;
import React, { useEffect, useState } from 'react';
import { fetchAllPokemonList } from '../Data_Fetching_and_Caching';
import PokemonCard from './PokemonCard';

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [displayedPokemon, setDisplayedPokemon] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('id');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all Pokémon data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const allPokemon = await fetchAllPokemonList();
      setPokemonList(allPokemon);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Update displayed Pokémon when dependencies change
  useEffect(() => {
    let filteredList = pokemonList;

    // Apply search filter
    if (searchQuery) {
      filteredList = filteredList.filter(
        (pokemon) =>
          pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pokemon.id.toString() === searchQuery
      );
    }

    // Apply sorting
    filteredList = [...filteredList].sort((a, b) => {
      if (sortCriteria === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortCriteria === 'name_reverse') {
        return b.name.localeCompare(a.name);
      } else if (sortCriteria === 'type') {
        return a.types[0].localeCompare(b.types[0]);
      } else if (sortCriteria === 'height') {
        return a.height - b.height;
      } else if (sortCriteria === 'height_reverse') {
        return b.height - a.height;
      } else if (sortCriteria === 'weight') {
        return a.weight - b.weight;
      } else if (sortCriteria === 'weight_reverse') {
        return b.weight - a.weight;
      } else if (sortCriteria === 'id') {
        return a.id - b.id;
      } else if (sortCriteria === 'id_reverse') {
        return b.id - a.id;
      } else {
        return 0;
      }
    });

    // Set the displayed Pokémon based on visibleCount
    if (!searchQuery) {
      setDisplayedPokemon(filteredList.slice(0, visibleCount));
    } else {
      setDisplayedPokemon(filteredList);
    }
  }, [pokemonList, visibleCount, searchQuery, sortCriteria]);

  // Handle sort criteria change
  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Load more Pokémon
  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 12);
  };

  return (
    <div>
      {/* Search and Sort Controls */}
      <div className="flex justify-between items-center space-x-3 ml-8 mr-8 mb-6">
        <input
          type="text"
          placeholder="Search by name or ID"
          value={searchQuery}
          onChange={handleSearchChange}
          className="py-3 px-5 ml-8 block w-1/3 border-2 border-gray-200 rounded-full text-sm"
        />
        <select
          onChange={handleSortChange}
          value={sortCriteria}
          className="py-3 px-5 block border-2 border-gray-200 rounded-full text-sm w-1/4"
        >
          <option value="id">ID: Low to High</option>
          <option value="id_reverse">ID: High to Low</option>
          <option value="name">Name: A to Z</option>
          <option value="name_reverse">Name: Z to A</option>
          <option value="height">Height: Low to High</option>
          <option value="height_reverse">Height: High to Low</option>
          <option value="weight">Weight: Low to High</option>
          <option value="weight_reverse">Weight: High to Low</option>
          <option value="type">Sort by Type</option>
        </select>
      </div>

      {/* Pokémon Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ml-8 mr-8">
        {displayedPokemon.length > 0 ? (
          displayedPokemon.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))
        ) : isLoading ? (
          <p>Loading Pokémon...</p>
        ) : (
          <p>No Pokémon found.</p>
        )}
      </div>

      {/* Load More Button */}
      {!searchQuery && visibleCount < pokemonList.length && (
        <div className="flex justify-center mb-8 mt-4">
          <button
            type="button"
            onClick={loadMore}
            className="py-3 px-4 w-1/3 gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-200 text-gray-500 hover:bg-gray-200"
          >
            Load More Pokémon
          </button>
        </div>
      )}
    </div>
  );
};

export default PokemonList;

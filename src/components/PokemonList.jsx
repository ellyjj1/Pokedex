import React, { useEffect, useState } from 'react';
import { fetchPokemonList, fetchAllPokemonNamesAndIds, getPokemonById } from '../Data_Fetching_and_Caching';
import PokemonCard from './PokemonCard';

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [allPokemon, setAllPokemon] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('id');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial Pokémon data
  useEffect(() => {
    if (!searchQuery) {
      const fetchData = async () => {
        setIsLoading(true);
        const list = await fetchPokemonList(visibleCount);
        setPokemonList(list);
        setIsLoading(false);
      };

      fetchData();
    }
  }, [visibleCount, searchQuery]);

  // Fetch all Pokémon names and IDs
  useEffect(() => {
    const fetchAllPokemon = async () => {
      const allPkmn = await fetchAllPokemonNamesAndIds();
      setAllPokemon(allPkmn);
    };

    fetchAllPokemon();
  }, []);

  // Fetch search results
  useEffect(() => {
    if (searchQuery) {
      const fetchSearchResults = async () => {
        setIsLoading(true);

        const filteredList = allPokemon.filter(
          (pokemon) =>
            pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pokemon.id.toString() === searchQuery
        );

        const promises = filteredList.map((pokemon) => getPokemonById(pokemon.id));
        const detailedList = await Promise.all(promises);

        const sortedList = detailedList.sort((a, b) => {
          // Sorting logic based on sortCriteria
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

        setSearchResults(sortedList);
        setIsLoading(false);
      };

      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, sortCriteria]);

  // Handle sort criteria change
  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Load more function
  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 12);
  };

  // Determine which list to display
  const displayedPokemon = searchQuery ? searchResults : pokemonList;

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
          {/* Sorting options */}
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
      {!searchQuery && visibleCount < 151 && (
        <div className="flex justify-center mb-8 mt-4">
          <button
            type="button"
            onClick={loadMore}
            className="py-3 px-4 w-1/3 gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-200 text-gray-500 hover:bg-gray-200"
          >
            {isLoading ? 'Loading...' : 'Load More Pokémon'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PokemonList;

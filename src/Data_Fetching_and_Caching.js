// src/Data_Fetching_and_Caching.jsx

import axios from 'axios';
import { openDB } from 'idb';

const API_URL = 'https://pokeapi.co/api/v2';

// Open or create an IndexedDB database
const dbPromise = openDB('pokedex-db', 3, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('pokemon')) {
      db.createObjectStore('pokemon', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('pokemonSpecies')) {
      db.createObjectStore('pokemonSpecies', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('allPokemon')) {
      db.createObjectStore('allPokemon');
    }
  },
});

/**
 * Fetch a list of Pokémon and cache in IndexedDB.
 * @param {number} limit - Number of Pokémon to fetch.
 * @param {number} offset - Offset for pagination.
 * @returns {Promise<Array>} - List of Pokémon data.
 */
export const fetchPokemonList = async (limit = 12, offset = 0) => {
  const db = await dbPromise;

  // Try to get Pokémon from IndexedDB
  const cachedPokemon = await db.getAll('pokemon');

  // Check if we have enough cached data
  const requiredIds = Array.from({ length: limit }, (_, i) => i + offset + 1);
  const cachedIds = cachedPokemon.map((p) => p.id);
  const missingIds = requiredIds.filter((id) => !cachedIds.includes(id));

  if (missingIds.length === 0) {
    // All required Pokémon are cached
    return cachedPokemon.filter((p) => requiredIds.includes(p.id));
  } else {
    // Fetch missing Pokémon data
    const promises = missingIds.map(async (id) => {
      const pokemonData = await getPokemonById(id);
      return pokemonData;
    });

    const fetchedPokemon = await Promise.all(promises);

    // Return combined cached and fetched data
    const allPokemon = [...cachedPokemon, ...fetchedPokemon].filter((p) =>
      requiredIds.includes(p.id)
    );

    return allPokemon;
  }
};

/**
 * Fetch Pokémon details by ID, using IndexedDB cache if available.
 * @param {number|string} id - Pokémon ID.
 * @returns {Promise<Object|null>} - Pokémon data.
 */
export const getPokemonById = async (id) => {
  const db = await dbPromise;
  const pokemonId = parseInt(id);

  // Try to get Pokémon from IndexedDB
  let pokemon = await db.get('pokemon', pokemonId);
  if (pokemon) {
    return pokemon;
  } else {
    // Fetch from API
    try {
      const response = await axios.get(`${API_URL}/pokemon/${pokemonId}`);
      const { id, name, types, height, weight, sprites, abilities, stats } = response.data;

      pokemon = {
        id,
        name,
        types: types.map((typeInfo) => typeInfo.type.name),
        height,
        weight,
        image: sprites.other.dream_world.front_default || sprites.front_default,
        abilities: abilities.map((ability) => ability.ability.name),
        stats: stats.map((stat) => ({
          name: stat.stat.name,
          value: stat.base_stat,
        })),
      };

      // Store in IndexedDB
      await db.put('pokemon', pokemon);

      return pokemon;
    } catch (error) {
      console.error(`Error fetching Pokémon with ID ${id}:`, error);
      return null;
    }
  }
};

/**
 * Fetch Pokémon species data by ID, using IndexedDB cache if available.
 * @param {number|string} id - Pokémon ID.
 * @returns {Promise<Object|null>} - Species data.
 */
export const getPokemonSpeciesById = async (id) => {
  const db = await dbPromise;
  const speciesId = parseInt(id);

  // Try to get species data from IndexedDB
  let speciesData = await db.get('pokemonSpecies', speciesId);
  if (speciesData) {
    return speciesData;
  } else {
    // Fetch from API
    try {
      const response = await axios.get(`${API_URL}/pokemon-species/${speciesId}`);
      speciesData = response.data;

      // Store in IndexedDB
      await db.put('pokemonSpecies', { id: speciesId, ...speciesData });

      return speciesData;
    } catch (error) {
      console.error(`Error fetching species data for Pokémon ID ${id}:`, error);
      return null;
    }
  }
};

/**
 * Fetch type data and cache in IndexedDB.
 * @param {string} typeName - Name of the Pokémon type.
 * @returns {Promise<Object|null>} - Type data.
 */
export const getTypeData = async (typeName) => {
  const db = await dbPromise;

  // Try to get type data from IndexedDB
  let typeData = await db.get('typeData', typeName);
  if (typeData) {
    return typeData;
  } else {
    // Fetch from API
    try {
      const response = await axios.get(`${API_URL}/type/${typeName}`);
      typeData = response.data;

      // Store in IndexedDB
      await db.put('typeData', { name: typeName, ...typeData });

      return typeData;
    } catch (error) {
      console.error(`Error fetching data for type ${typeName}:`, error);
      return null;
    }
  }
};

/**
 * Fetch the evolution chain for a Pokémon species.
 * @param {string} url - Evolution chain URL.
 * @returns {Promise<Array>} - List of evolution stages.
 */
export const getEvolutionChain = async (url) => {
  const db = await dbPromise;

  // Generate a unique key for the evolution chain
  const chainId = url.split('/').filter(Boolean).pop();

  // Try to get evolution chain from IndexedDB
  let evolutionChain = await db.get('evolutionChain', chainId);
  if (evolutionChain) {
    return evolutionChain.chain;
  } else {
    // Fetch from API
    try {
      const response = await axios.get(url);
      evolutionChain = response.data;

      // Store in IndexedDB
      await db.put('evolutionChain', { id: chainId, chain: evolutionChain.chain });

      return evolutionChain.chain;
    } catch (error) {
      console.error(`Error fetching evolution chain from ${url}:`, error);
      return null;
    }
  }
};


// Data_Fetching_and_Caching.js

export const fetchAllPokemonNamesAndIds = async () => {
  const db = await dbPromise;
  let allPokemon = await db.get('allPokemon', 'namesAndIds');
  if (allPokemon) {
    return allPokemon;
  } else {
    try {
      const response = await axios.get(`${API_URL}/pokemon?limit=151&offset=0`);
      const pokemonList = response.data.results.map((pokemon) => {
        const urlSegments = pokemon.url.split('/').filter(Boolean);
        const id = parseInt(urlSegments[urlSegments.length - 1], 10);
        return { id, name: pokemon.name };
      });

      // Store in IndexedDB
      await db.put('allPokemon', pokemonList, 'namesAndIds');
      return pokemonList;
    } catch (error) {
      console.error('Error fetching all Pokémon names and IDs:', error);
      return [];
    }
  }
};

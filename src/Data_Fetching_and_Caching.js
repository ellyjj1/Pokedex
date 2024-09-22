// Data_Fetching_and_Caching.js

import axios from 'axios';
import { openDB } from 'idb';

const API_URL = 'https://pokeapi.co/api/v2';

// Initialize IndexedDB
const dbPromise = openDB('pokedex-db', 3, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('pokemon')) {
      db.createObjectStore('pokemon', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('pokemonSpecies')) {
      db.createObjectStore('pokemonSpecies', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('typeData')) {
      db.createObjectStore('typeData', { keyPath: 'name' });
    }
    if (!db.objectStoreNames.contains('evolutionChain')) {
      db.createObjectStore('evolutionChain', { keyPath: 'id' });
    }
  },
});

// Fetch all 151 Pokémon and cache them
export const fetchAllPokemonList = async () => {
  const db = await dbPromise;
  const cachedPokemon = await db.getAll('pokemon');

  if (cachedPokemon.length >= 151) {
    // If all Pokémon are cached, return them
    return cachedPokemon;
  } else {
    try {
      // Fetch Pokémon list
      const response = await axios.get(`${API_URL}/pokemon?limit=151&offset=0`);
      const pokemonList = response.data.results;

      // Fetch detailed data for each Pokémon
      const detailedList = await Promise.all(
        pokemonList.map(async (pokemon) => {
          const urlSegments = pokemon.url.split('/').filter(Boolean);
          const id = urlSegments[urlSegments.length - 1];
          const details = await getPokemonById(id);
          return details;
        })
      );

      // Store in cache
      for (const pokemon of detailedList) {
        if (pokemon) {
          await db.put('pokemon', pokemon);
        }
      }

      return detailedList;
    } catch (error) {
      console.error('Error fetching all Pokémon:', error);
      return [];
    }
  }
};

// Get detailed Pokémon data by ID, with caching
export const getPokemonById = async (id) => {
  const db = await dbPromise;
  const pokemonId = parseInt(id, 10);

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

// Get Pokémon species data by ID, with caching
export const getPokemonSpeciesById = async (id) => {
  const db = await dbPromise;
  const speciesId = parseInt(id, 10);

  // Try to get species data from IndexedDB
  let speciesData = await db.get('pokemonSpecies', speciesId);
  if (speciesData) {
    return speciesData;
  } else {
    // Fetch from API
    try {
      const response = await axios.get(`${API_URL}/pokemon-species/${speciesId}`);
      speciesData = { id: speciesId, ...response.data };

      // Store in IndexedDB
      await db.put('pokemonSpecies', speciesData);

      return speciesData;
    } catch (error) {
      console.error(`Error fetching species data for Pokémon ID ${id}:`, error);
      return null;
    }
  }
};

// Fetch type data and cache in IndexedDB
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
      typeData = { name: typeName, ...response.data };

      // Store in IndexedDB
      await db.put('typeData', typeData);

      return typeData;
    } catch (error) {
      console.error(`Error fetching data for type ${typeName}:`, error);
      return null;
    }
  }
};

// Fetch the evolution chain for a Pokémon species and cache it
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
      evolutionChain = { id: chainId, chain: response.data.chain };

      // Store in IndexedDB
      await db.put('evolutionChain', evolutionChain);

      return evolutionChain.chain;
    } catch (error) {
      console.error(`Error fetching evolution chain from ${url}:`, error);
      return null;
    }
  }
};

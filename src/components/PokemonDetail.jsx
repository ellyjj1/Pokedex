import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import arrow from '../assets/arrow.png'; 
import { getPokemonById, getPokemonSpeciesById } from '../Data_Fetching_and_Caching';
import axios from 'axios';
import { getTypeColor } from '../utils/getTypeColor';

const PokemonDetail = () => {
  const [pokemon, setPokemon] = useState(null);
  const [evolutions, setEvolutions] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  // Get Pokémon data based on ID. 
  // Not all data is from the same API link, so create multiple functions to get different data, avoiding more loops.
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const detailedPokemon = await getPokemonById(id);
        if (!detailedPokemon) {
          console.error('No Pokémon data found.');
          return;
        }

        const speciesData = await getPokemonSpeciesById(id);
        if (!speciesData) {
          console.error('No species data found.');
          return;
        }

        // Extract versions and descriptions
        const versions = {};
        speciesData.flavor_text_entries.forEach((entry) => {
          if (entry.language.name === 'en') {
            const versionName = entry.version.name;
            if (!versions[versionName]) {
              versions[versionName] = entry.flavor_text
                .replace(/\f/g, ' ')
                .replace(/\n|\r/g, ' ');
            }
          }
        });

        const evolutionChainUrl = speciesData.evolution_chain.url;
        const evolutionResponse = await axios.get(evolutionChainUrl);

        const evolutionData = [];
        let evoChain = evolutionResponse.data.chain;

        // Loop through the evolution chain
        while (evoChain) {
          const evoId = evoChain.species.url.split('/').slice(-2, -1)[0];
          const evoPokemon = await getPokemonById(evoId);
          if (evoPokemon) {
            evolutionData.push({
              name: evoChain.species.name,
              id: evoId,
              types: evoPokemon.types,
            });
          }
          evoChain = evoChain.evolves_to[0];
        }

        // Fetch weaknesses based on types
        let typeWeaknesses = [];
        for (const type of detailedPokemon.types) {
          const typeResponse = await axios.get(
            `https://pokeapi.co/api/v2/type/${type}`
          );
          const weakTo = typeResponse.data.damage_relations.double_damage_from.map(
            (weakType) => weakType.name
          );
          typeWeaknesses.push(...weakTo);
        }

        const uniqueWeaknesses = [...new Set(typeWeaknesses)].filter(
          (weakness) => !detailedPokemon.types.includes(weakness)
        );

        // Set state
        setPokemon({
          ...detailedPokemon,
          category:
            speciesData.genera.find((genus) => genus.language.name === 'en')?.genus ||
            '',
          versions,
        });
        setWeaknesses(uniqueWeaknesses);
        setEvolutions(evolutionData);
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      }
    };

    fetchPokemon();
  }, [id]);

  if (!pokemon) return <div>Loading Pokémon details...</div>;

  return (
    <div className="pokemon-detail-container p-6  text-neutral-200 rounded-lg mt-4 ml-8 mr-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        <div className="w-full flex justify-center ">
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className="rounded-lg shadow-lg max-w-xs p-4 bg-neutral-100 "
            loading="lazy"
          />
        </div>

        <div className="w-full col-span-2  p-4">
          <h1 className="font-bold text-black text-2xl">
            #{pokemon.id} {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </h1>

          {/* Versions Section - Choose which one? 
          <div className="mb-4 mt-4">
            <h3 className="font-bold text-lg text-black">Versions:</h3>
            <div className="flex flex-col space-y-2 mt-2">
              {pokemon.versions &&
                Object.entries(pokemon.versions).map(([version, description]) => (
                  <div key={version} className="bg-neutral-600 p-4 rounded-lg">
                    <h4 className="font-bold text-white">
                      {version.charAt(0).toUpperCase() + version.slice(1)}
                    </h4>
                    <p className="text-neutral-400">{description}</p>
                  </div>
                ))}
            </div>
          </div> */}

          <div className="grid grid-cols-2 gap-4 mb-6 mt-4">
            <div className="bg-neutral-600 p-4 rounded-lg">
              <h3 className="text-white">Height: {pokemon.height} ft</h3>
            </div>
            <div className="bg-neutral-600 p-4 rounded-lg">
              <h3 className="text-white">Weight: {pokemon.weight} lbs</h3>
            </div>
            <div className="bg-neutral-600 p-4 rounded-lg">
              <h3 className="text-white">Category: {pokemon.category}</h3>
            </div>
            <div className="bg-neutral-600 p-4 rounded-lg">
              <h3 className="text-white">
                Abilities: {pokemon.abilities.join(', ')}
              </h3>
            </div>
          </div>

          {/* Type Section */}
          <div className="mb-4">
            <h3 className="font-bold text-lg text-black ">Type:</h3>
            <div className="flex space-x-2 mt-2">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className={`text-white px-4 py-1 rounded-lg ${getTypeColor(
                    type
                  )}`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              ))}
            </div>
          </div>

          {/* Weaknesses Section */}
          <div className="mb-4">
            <h3 className="font-bold text-lg text-black">Weaknesses:</h3>
            <div className="flex space-x-2 mt-2">
              {weaknesses.length > 0 ? (
                weaknesses.map((weakness) => (
                  <span
                    key={weakness}
                    className={`text-white px-4 py-1 rounded-lg ${getTypeColor(
                      weakness
                    )}`}
                  >
                    {weakness}
                  </span>
                ))
              ) : (
                <span className="text-neutral-400">No known weaknesses</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        {/* Stats Section */}
        <div className="rounded-lg shadow-lg p-4 bg-neutral-100">
          <h3 className="font-bold text-2xl text-black mb-4">Stats:</h3>
          <div className="grid grid-cols-2 gap-4 mt-2 mr-8">
            {pokemon.stats.map((stat) => (
              <div key={stat.name} className="bg-neutral-600 p-4 rounded-lg">
                <h4 className=" text-white">
                  {stat.name
                    .replace('special-attack', 'Special Attack')
                    .replace('special-defense', 'Special Defense')
                    .replace('attack', 'Attack')
                    .replace('defense', 'Defense')
                    .replace('speed', 'Speed')
                    .replace('hp', 'HP')}: {stat.value}
                </h4>
              </div>
            ))}
          </div>
        </div>

        {/* Evolutions Section */}
        <div className="rounded-lg shadow-lg p-4 bg-neutral-100">
          <h3 className="font-bold text-2xl text-black mb-4">Evolutions:</h3>
          <div className="flex space-x-4 items-start">
            {evolutions.map((evo, index) => (
              <React.Fragment key={evo.id}>
                <div className="flex items-center space-x-4">
                  {/* Pokémon Image and Name */}
                  <div className="text-center">
                    <div className="bg-neutral-600 p-4 rounded-full shadow-xl">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${evo.id}.svg`}
                        alt="Evolution Chain"
                        className="w-24 h-24 "
                        loading="lazy"
                      />
                    </div>
                    <p className="text-black">
                      #{evo.id} {evo.name}
                    </p>

                    {/* Types in Evolution */}
                    <div className="flex flex-col justify-start p-4 ">
                      {evo.types.map((type) => (
                        <span
                          key={type}
                          className={`inline-flex items-center gap-x-1.5 py-1.5 px-3 mt-1 rounded-full text-xs font-medium text-white font-semibold ${getTypeColor(
                            type
                          )} justify-center text-center`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Evolution Arrow */}
                  {index < evolutions.length - 1 && (
                    <img src={arrow} alt="evolution arrow" className="w-8 h-8" />
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          className="py-3 px-4 w-1/3  gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-neutral-600 text-gray-100 hover:bg-neutral-400"
          onClick={() => navigate('/')}
        >
          Explore More Pokémon
        </button>
      </div>
    </div>
  );
};

export default PokemonDetail;

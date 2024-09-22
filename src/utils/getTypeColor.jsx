
const typeColors = {
    grass: 'bg-green-500',
    poison: 'bg-purple-500',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-500',
    bug: 'bg-green-300',
    flying: 'bg-blue-300',
    ground: 'bg-yellow-300',
    fairy: 'bg-pink-300',
    ice: 'bg-fuchsia-400',
    psychic: 'bg-violet-300',
  };
  
  export const getTypeColor = (type) => {
    return typeColors[type.toLowerCase()] || 'bg-stone-400';
  };
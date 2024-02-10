function getPokemonInfo(pokemonNameOrId) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`;
    
    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('¡Se produjo un error al obtener la información del Pokémon:', error);
        });
}

function displayPokemon(pokemonData) {
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');
    
    const typeColor = getTypeColor(pokemonData.types[0].type.name); 
    pokemonCard.style.borderTop = `5px solid ${typeColor}`;
    pokemonCard.style.borderRadius = '8px';
    pokemonCard.style.padding = '10px'; pokemonCard.innerHTML = `
        <h2>${pokemonData.name}</h2>
        <p>nº: #${pokemonData.id}</p>
        <img src="${pokemonData.sprites.other.dream_world.front_default}" alt="${pokemonData.name}" />
        <p>Height: ${pokemonData.height}</p>
        <p>Weight: ${pokemonData.weight}</p>
        <h3>Types:</h3>
        <ul>
            ${pokemonData.types.map(type => `<li>${type.type.name}</li>`).join('')}
        </ul>
    `;
    return pokemonCard;
}

function getTypeColor(type) {
    const typeColors = {
        normal: '#A8A878',
        fire: '#F08030',
        water: '#6890F0',
        electric: '#F8D030',
        grass: '#78C850',
        ice: '#98D8D8',
        fighting: '#C03028',
        poison: '#A040A0',
        ground: '#E0C068',
        flying: '#A890F0',
        psychic: '#F85888',
        bug: '#A8B820',
        rock: '#B8A038',
        ghost: '#705898',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        fairy: '#EE99AC'
    };

    return typeColors[type.toLowerCase()] || '#B0B0B0';
}

document.addEventListener("DOMContentLoaded", function() {
    const pokemonContainer = document.getElementById('pokemon-container');

    fetch('https://pokeapi.co/api/v2/pokemon?limit=16')
        .then(response => response.json())
        .then(data => {
            data.results.forEach(pokemon => {
                fetch(pokemon.url)
                    .then(response => response.json())
                    .then(pokemonData => {
                        const pokemonCard = displayPokemon(pokemonData);
                        pokemonContainer.appendChild(pokemonCard);
                    });
            });
        })
        .catch(error => console.error('Erro ao carregar os Pokémon:', error));
});

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const searchTerm = document.getElementById('search-input').value;
    getPokemonInfo(searchTerm.toLowerCase())
        .then(pokemonData => {
            const pokemonContainer = document.getElementById('pokemon-container');
            pokemonContainer.innerHTML = '';
            const pokemonCard = displayPokemon(pokemonData);
            pokemonContainer.appendChild(pokemonCard);
        });
});

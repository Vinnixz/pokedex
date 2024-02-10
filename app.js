function getPokemonInfo(pokemonNameOrId) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`;
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayPokemon(data);
        })
        .catch(error => {
            console.error('¡Se produjo un error al obtener la información del Pokémon:', error);
        });
}

function displayPokemon(pokemonData) {
    const pokemonContainer = document.getElementById('pokemon-container');
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');
    pokemonCard.innerHTML = `
        <h2>${pokemonData.name}</h2>
        <p>nº: #00${pokemonData.id}</p>
        <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" />
        <p>Height: ${pokemonData.height}</p>
        <p>Weight: ${pokemonData.weight}</p>
        <h3>Types:</h3>
        <ul>
            ${pokemonData.types.map(type => `<li>${type.type.name}</li>`).join('')}
        </ul>
    `;
    pokemonContainer.innerHTML = '';
    pokemonContainer.appendChild(pokemonCard);
}

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const searchTerm = document.getElementById('search-input').value;
    getPokemonInfo(searchTerm.toLowerCase());
});

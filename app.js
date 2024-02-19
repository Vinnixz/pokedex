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

function getPokemonImage(pokemonData) {
    if (pokemonData.sprites.other['dream_world'].front_default) {
        return pokemonData.sprites.other['dream_world'].front_default;
    } else if (pokemonData.sprites.other['official-artwork'].front_default) {
        return pokemonData.sprites.other['official-artwork'].front_default;
    } else {
        return 'https://via.placeholder.com/150';
    }
}

function displayPokemon(pokemonData) {
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');
    
    const typeColor = getTypeColor(pokemonData.types[0].type.name); 
    const typeColorTransparent = getTypeColors(pokemonData.types[0].type.name); 
    pokemonCard.style.borderTop = `5px solid ${typeColor}`;
    pokemonCard.style.borderRadius = '8px';
    pokemonCard.style.backgroundColor = `${typeColorTransparent}`;
    pokemonCard.style.padding = '10px'; 
    pokemonCard.innerHTML = `
        <h2>${pokemonData.name}</h2>
        <p class="number" style="color: #686868;">nº: #${pokemonData.id}</p>
        <img src="${getPokemonImage(pokemonData)}" alt="${pokemonData.name}" />
        <p>Height: ${pokemonData.height}</p>
        <p>Weight: ${pokemonData.weight}</p>
        <h4>Types:</h4>
            <div class="type-style">
            ${pokemonData.types.map(type => `<p class="type" style="background-color:${typeColor}">${type.type.name}</p>`).join('')}
            </div>
        `;
    return pokemonCard;
}

function getTypeColor(type) {
    const typeColors = {
        normal: 'rgba(168, 168, 120)',
        fire: 'rgba(240, 128, 48)',
        water: 'rgba(104, 144, 240)',
        electric: 'rgba(248, 208, 48)',
        grass: 'rgba(120, 200, 80)',
        ice: 'rgba(152, 216, 216)',
        fighting: 'rgba(192, 48, 40)',
        poison: 'rgba(160, 64, 160)',
        ground: 'rgba(224, 192, 104)',
        flying: 'rgba(168, 144, 240)',
        psychic: 'rgba(248, 88, 136)',
        bug: 'rgba(168, 184, 32)',
        rock: 'rgba(184, 160, 56)',
        ghost: 'rgba(112, 88, 152)',
        dragon: 'rgba(112, 56, 248)',
        dark: 'rgba(112, 88, 72)',
        steel: 'rgba(184, 184, 208)',
        fairy: 'rgba(238, 153, 172)'
    };

    return typeColors[type.toLowerCase()] || 'rgba(176, 176, 176, 1)';
}

function getTypeColors(type) {
    const typeColorTransparent = {
        normal: 'rgba(168, 168, 120, 0.1)',
        fire: 'rgba(240, 128, 48, 0.1)',
        water: 'rgba(104, 144, 240, 0.1)',
        electric: 'rgba(248, 208, 48, 0.1)',
        grass: 'rgba(120, 200, 80, 0.1)',
        ice: 'rgba(152, 216, 216, 0.1)',
        fighting: 'rgba(192, 48, 40, 0.1)',
        poison: 'rgba(160, 64, 160, 0.1)',
        ground: 'rgba(224, 192, 104, 0.1)',
        flying: 'rgba(168, 144, 240, 0.1)',
        psychic: 'rgba(248, 88, 136, 0.1)',
        bug: 'rgba(168, 184, 32, 0.1)',
        rock: 'rgba(184, 160, 56, 0.1)',
        ghost: 'rgba(112, 88, 152, 0.1)',
        dragon: 'rgba(112, 56, 248, 0.1)',
        dark: 'rgba(112, 88, 72, 0.1)',
        steel: 'rgba(184, 184, 208, 0.1)',
        fairy: 'rgba(238, 153, 172, 0.1)'
    };

    return typeColorTransparent[type.toLowerCase()] || 'rgba(176, 176, 176, 0.1)';
}

function loadMorePokemon(offset = 0, typeFilter = '') {
    const pokemonContainer = document.getElementById('pokemon-container');
    const limit = 20; 
    let apiUrl = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    
    // Se um tipo foi selecionado, adiciona o filtro à URL da API
    if (typeFilter) {
        apiUrl += `&type=${typeFilter}`;
    }

    console.log("API URL:", apiUrl); // Verifica a URL da API
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Pokémon filtrados:", data.results); // Verifica os Pokémon filtrados
            const newPokemonPromises = [];
            data.results.forEach(pokemon => {
                newPokemonPromises.push(
                    fetch(pokemon.url)
                        .then(response => response.json())
                        .catch(error => console.error('Erro ao carregar os Pokémon:', error))
                );
            });

            Promise.all(newPokemonPromises)
                .then(pokemonDataArray => {
                    pokemonDataArray.forEach(pokemonData => {
                        if (!document.querySelector(`.pokemon-card[data-pokemon-id="${pokemonData.id}"]`)) {
                            const pokemonCard = displayPokemon(pokemonData);
                            pokemonCard.setAttribute('data-pokemon-id', pokemonData.id);
                            pokemonContainer.appendChild(pokemonCard);
                        }
                    });
                })
                .catch(error => console.error('Erro ao carregar os Pokémon:', error));
        })
        .catch(error => console.error('Erro ao carregar a lista de Pokémon:', error));
}

function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        const pokemonContainer = document.getElementById('pokemon-container');
        const currentOffset = pokemonContainer.querySelectorAll('.pokemon-card').length;
        loadMorePokemon(currentOffset);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const searchForm = document.getElementById('search-form');
    const typeFilter = document.getElementById('type-filter');

    loadMorePokemon(); // Carrega os Pokémon inicialmente

    window.addEventListener('scroll', handleScroll);

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        getPokemonInfo(searchTerm)
            .then(pokemonData => {
                const pokemonContainer = document.getElementById('pokemon-container');
                pokemonContainer.innerHTML = ''; // Limpa o conteúdo anterior
                const pokemonCard = displayPokemon(pokemonData);
                pokemonContainer.appendChild(pokemonCard);
            })
            .catch(error => console.error('Erro ao obter informações do Pokémon:', error));
    });

    typeFilter.addEventListener('change', function() {
        const pokemonContainer = document.getElementById('pokemon-container');
        pokemonContainer.innerHTML = ''; // Limpa o conteúdo anterior
        loadMorePokemon(0, typeFilter.value);
    });
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

document.addEventListener("DOMContentLoaded", function() {
    const pokemonContainer = document.getElementById('pokemon-container');

    pokemonContainer.addEventListener('click', function(event) {
        const pokemonCard = event.target.closest('.pokemon-card');
        if (pokemonCard) {
            if (pokemonCard.classList.contains('pokemon-card-clicked')) {
                pokemonCard.classList.remove('pokemon-card-clicked');
            } else {
                const allPokemonCards = pokemonContainer.querySelectorAll('.pokemon-card');
                allPokemonCards.forEach(card => card.classList.remove('pokemon-card-clicked'));
                pokemonCard.classList.add('pokemon-card-clicked');
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const pokemonContainer = document.getElementById('pokemon-container');
    const searchForm = document.getElementById('search-form');

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        getPokemonInfo(searchTerm)
            .then(pokemonData => {
                pokemonContainer.innerHTML = ''; 
                const pokemonCard = displayPokemon(pokemonData);
                pokemonContainer.appendChild(pokemonCard);
            })
            .catch(error => console.error('Erro ao obter informações do Pokémon:', error));
    });
});


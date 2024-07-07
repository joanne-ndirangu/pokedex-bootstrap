import * as bootstrap from 'bootstrap'

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const characterList = document.getElementById('character-list');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');

    let allPokemon = [];
    let filteredPokemon = [];
    let currentPage = 1;
    const itemsPerPage = 9;

    // Fetch Pokemon data from PokeAPI
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
        .then(res => res.json())
        .then(data => {
            const fetchPromises = data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
            return Promise.all(fetchPromises);
        })
        .then(pokemonData => {
            allPokemon = pokemonData; // Store all Pokemon data
            filteredPokemon = allPokemon.slice(); // Initially, filteredPokemon is the same as allPokemon
            displayPage(currentPage); // Initial display of first page of Pokemon
        })
        .catch(error => console.error('Error fetching Pokemon data:', error));

        // Function to display a page of Pokemon
    function displayPage(page) {
        characterList.innerHTML = ''; // Clear previous content

        const start = (page - 1) * itemsPerPage;
        const end = page * itemsPerPage;
        const paginatedItems = filteredPokemon.slice(start, end);

        paginatedItems.forEach(pokemon => {
            const card = createPokemonCard(pokemon);
            characterList.appendChild(card);
        });

        // Update pagination buttons
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = end >= filteredPokemon.length;
    }

    // Function to create a Pokemon card
    function createPokemonCard(pokemon) {
        const card = document.createElement('div');
        card.className = 'col mb-4';
        card.innerHTML = `
            <div class="character-card m-10 p-20 d-flex flex-column align-items-center">
                <img class="w-30 h-30" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <h2>${pokemon.name}</h2>
                <p>Type: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
                <div class="character-details hidden">
                    <p>Abilities: ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
                    <p>Base Stats:</p>
                    <ul>
                        ${pokemon.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        // Click functionality to toggle details
        card.querySelector('.character-card').addEventListener('click', function() {
            const details = this.querySelector('.character-details');
            details.style.display = details.style.display === 'block' ? 'none' : 'block';
        });

        return card;
    }

    // Event listener for previous page button
    prevPageButton.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            displayPage(currentPage);
        }
    });

    // Event listener for next page button
    nextPageButton.addEventListener('click', function() {
        if ((currentPage * itemsPerPage) < filteredPokemon.length) {
            currentPage++;
            displayPage(currentPage);
        }
    });

    // Function to filter Pokemon based on search term
    function filterCharacters(searchTerm) {
        searchTerm = searchTerm.trim().toLowerCase();

        if (searchTerm === '') {
            // If search term is empty, reset filteredPokemon to allPokemon
            filteredPokemon = allPokemon.slice();
        } else {
            // Filter allPokemon based on search term
            filteredPokemon = allPokemon.filter(pokemon =>
                pokemon.name.toLowerCase().includes(searchTerm)
            );
        }

        currentPage = 1; // Reset to first page on search or clear

        displayPage(currentPage); // Display the filtered or all characters
    }

    // Search functionality
    searchInput.addEventListener('input', function() {
        filterCharacters(this.value);
    });
});

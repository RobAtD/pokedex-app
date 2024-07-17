// Create Object with a list of Pokemons
let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=1302';

    // Get all Pokemons
    function getAll() {
        return pokemonList;
    }

    // Add a Pokemon to the list
    function add(pokemon) {
        if (typeof pokemon !== 'object') {
            console.log('Pokemon is not an Object!');
        } else {
            pokemonList.push(pokemon);
        }
    }

    // Adds all registered Pokemon
    function addListItem(pokemon) {
        let list = document.querySelector('ul');
        let listItem = document.createElement('li');
        let button = document.createElement('button');
        button.innerText = pokemon.name;
        button.classList.add('pokemonEntry');
        listItem.appendChild(button);
        list.appendChild(listItem);
        showDetails(button, pokemon);
    }

    // Show Pokemon on button click
    function showDetails(button, pokemon) {
        button.addEventListener('click', function (event) {
            loadDetails(pokemon).then(function () {
                console.log(pokemon);
            });
        });
    }

    function loadList() {
        showLoadingMessage();
        return fetch(apiUrl)
            .then(function (response) {
                hideLoadingMessage();
                return response.json();
            })
            .then(function (json) {
                json.results.forEach(function (item) {
                    let pokemon = {
                        name: item.name,
                        detailsUrl: item.url,
                    };
                    add(pokemon);
                });
            })
            .catch(function (e) {
                hideLoadingMessage();
                console.error(e);
            });
    }

    function loadDetails(pokemon) {
        showLoadingMessage();
        let url = pokemon.detailsUrl;
        return fetch(url)
            .then(function (response) {
                hideLoadingMessage();
                return response.json();
            })
            .then(function (details) {
                pokemon.imageURL = details.sprites.front_default;
                pokemon.height = details.height;
                pokemon.types = details.types;
            })
            .catch(function (e) {
                hideLoadingMessage();
                console.error(e);
            });
    }

    function showLoadingMessage() {
        let main = document.querySelector('main');
        let loadingText = document.createElement('h2');
        loadingText.id = 'loading-text';
        loadingText.innerText = 'Loading...';
        main.prepend(loadingText);
    }

    function hideLoadingMessage() {
        let getLoadingText = document.getElementById('loading-text');
        getLoadingText.remove();
    }

    return {
        getAll: getAll,
        add: add,
        addListItem: addListItem,
        loadList: loadList,
        loadDetails: loadDetails,
    };
})();

// Print all Pokemons
function printPokemonList(pokemon) {
    pokemonRepository.addListItem(pokemon);
}

// Log Pokemons to console
function logPokemonList(pokemon) {
    console.log(pokemon.name);
}

// Filter Pokemons by name
function filterByName(pokemonName) {
    return pokemonRepository
        .getAll()
        .filter((name) =>
            name.name.toLowerCase().includes(pokemonName.toLowerCase())
        );
}

// Log pokemonRepository
console.log(pokemonRepository.getAll());

// Print all Pokemons
pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(printPokemonList);
    // Filter Pokemon names
    //filterByName('m').forEach(logPokemonList);
});

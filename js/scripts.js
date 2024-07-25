// Create Object with a list of Pokemons
let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=1302';
    let pokemonDetailsContainer = document.querySelector(
        '#pokemonDetails-container'
    );

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
        button.innerText =
            pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        button.classList.add('pokemonEntry');
        listItem.appendChild(button);
        list.appendChild(listItem);
        showDetails(button, pokemon);
    }

    // Show Pokemon details on button click
    function showDetails(button, pokemon) {
        button.addEventListener('click', function (event) {
            loadDetails(pokemon).then(function () {
                pokemonDetailsContainer.innerHTML = '';

                // Create the elements for the details
                let pokemonDetails = document.createElement('div');
                let pokemonDetailsItems = document.createElement('div');
                let buttonClose = document.createElement('button');
                let img = document.createElement('img');
                let name = document.createElement('p');
                let height = document.createElement('p');
                let types = document.createElement('p');

                // Add the right classes to the elements
                pokemonDetails.classList.add('pokemonDetails');
                pokemonDetailsItems.classList.add('pokemonDetails-items');
                buttonClose.classList.add('pokemonDetails-close');
                img.classList.add('pokemon-img');

                // Add the content to the elements
                buttonClose.innerText = 'X';
                img.src = pokemon.imageURL;
                name.innerText =
                    'Name: ' +
                    pokemon.name.charAt(0).toUpperCase() +
                    pokemon.name.slice(1);
                height.innerText = 'Height: ' + pokemon.height;
                types.innerText = 'Types: ' + pokemon.types.map(getTypes);

                // Add elements to the DOM
                pokemonDetailsContainer.appendChild(pokemonDetails);
                pokemonDetails.appendChild(buttonClose);
                pokemonDetails.appendChild(img);
                pokemonDetails.appendChild(pokemonDetailsItems);
                pokemonDetailsItems.appendChild(name);
                pokemonDetailsItems.appendChild(height);
                pokemonDetailsItems.appendChild(types);

                // Add is-visible class to details container
                pokemonDetailsContainer.classList.add('is-visible');

                // Hide details when clicked inside the container
                pokemonDetailsContainer.addEventListener('click', (e) => {
                    let target = e.target;
                    if (target === pokemonDetailsContainer) {
                        hideDetails();
                    }
                });

                // Pointer events
                let xDown;
                let xUp;
                pokemonDetails.addEventListener('pointerdown', handleDown);

                // Pointer down function
                function handleDown(e) {
                    xDown = e.pageX;

                    console.log(xDown);
                    let index = pokemonList.indexOf(pokemon);
                    index++;

                    console.log(index + " Test");

                    pokemonDetails.addEventListener('pointerup', handleUp);
                }

                // Pointer up function
                function handleUp(e) {
                    xUp = e.pageX;
                    console.log(xUp);
                    console.log('Difference: ' + (xDown - xUp));

                    if (xUp <= xDown - 100) {
                        console.log('Next Pokemon');
                        pokemonList.forEach(function (index) {
                            if (index.name === pokemon.name) {
                                let i = pokemonList.indexOf(index);
                                console.log(pokemon);

                                loadDetails(pokemonList[i+1]).then(function (){
                                    console.log(pokemonList[i+1]);
                                    name.innerText =
                                    'Name: ' +
                                    pokemon.name.charAt(0).toUpperCase() +
                                    pokemon.name.slice(1);
                                });

                                console.log(pokemonList.indexOf(index));
                            }
                        });
                    }

                    if (xUp >= xDown + 100) {
                        console.log('Previous Pokemon');
                    }
                }

                // Hide details on button click
                buttonClose.addEventListener('click', hideDetails);

                // Get types function
                function getTypes(item) {
                    return [item.type.name].join(', ');
                }
            });
        });
    }

    // Hide details function
    function hideDetails() {
        pokemonDetailsContainer.classList.remove('is-visible');
    }

    // Hide details when Escape button has been pressed
    window.addEventListener('keydown', (e) => {
        if (
            e.key === 'Escape' &&
            pokemonDetailsContainer.classList.contains('is-visible')
        ) {
            hideDetails();
        }
    });

    // Load pokemon from API
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

    // Load pokemon details from API
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

    // Show a loading message
    function showLoadingMessage() {
        let main = document.querySelector('main');
        let loadingText = document.createElement('h2');
        loadingText.id = 'loading-text';
        loadingText.innerText = 'Loading...';
        main.prepend(loadingText);
    }

    // Hide the loading message
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
//console.log(pokemonRepository.getAll());

// Print all Pokemons
pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(printPokemonList);
    // Filter Pokemon names
    //filterByName('m').forEach(logPokemonList);
});

// Create Object with a list of Pokemons
let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=1302';
    let loadingSpinnerContainer = document.querySelector(
        '#loadingSpinner-container'
    );
    let previousButton = $('#previous-pokemon');
    let nextButton = $('#next-pokemon');

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

    // Add all registered Pokemon
    function addListItem(pokemon) {
        let list = document.querySelector('ul');
        let listItem = document.createElement('li');
        let button = document.createElement('button');

        button.setAttribute('data-toggle', 'modal');
        button.setAttribute('data-target', '#pokemonDetails-container');
        button.innerText =
            pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        button.classList.add('btn', 'btn-primary', 'btn-lg', 'btn-block');

        listItem.classList.add('list-group-item');
        listItem.appendChild(button);
        list.appendChild(listItem);
        showDetails(button, pokemon);
    }

    // Show Pokemon details on button click
    function showDetails(button, pokemon) {
        button.addEventListener('click', function () {
            loadDetails(pokemon).then(function () {
                let detailsTitle = $('.modal-title');
                let detailsBody = $('.modal-body');
                let detailsContent = document.querySelector('.modal-body');

                // Empty the title and content of the modal
                detailsTitle.empty();
                detailsBody.empty();

                // Create the elements for the details
                let imgFront = $('<img class="modal-img" style="width:50%" />');
                imgFront.attr('src', pokemon.imageURLFront);
                imgFront.attr(
                    'aria-label',
                    'Front image of ' +
                        pokemon.name.charAt(0).toUpperCase() +
                        pokemon.name.slice(1)
                );

                let imgBack = $('<img class="modal-img" style="width:50%" />');
                imgBack.attr('src', pokemon.imageURLBack);
                imgBack.attr(
                    'aria-label',
                    'Back image of ' +
                        pokemon.name.charAt(0).toUpperCase() +
                        pokemon.name.slice(1)
                );

                let name = $(
                    '<p>Name: ' +
                        pokemon.name.charAt(0).toUpperCase() +
                        pokemon.name.slice(1) +
                        '</p>'
                );

                let height = $('<p>Height: ' + pokemon.height + '</p>');
                let types = $(
                    '<p>Types: ' +
                        pokemon.types.map((type) => type.type.name).join(', ') +
                        '</p>'
                );

                // Add elements to the DOM
                detailsTitle.append(name);
                detailsBody.append(imgFront);
                detailsBody.append(imgBack);
                detailsBody.append(height);
                detailsBody.append(types);

                //Touch event variables
                let xDown;
                let xUp;
                let index = pokemonList.indexOf(pokemon);

                detailsContent.addEventListener('touchstart', handleStart);

                // Touch start
                function handleStart(e) {
                    xDown = e.changedTouches[0].screenX;

                    detailsContent.addEventListener('touchend', handleEnd);
                }

                // Touch end
                function handleEnd(e) {
                    xUp = e.changedTouches[0].screenX;

                    if (xUp <= xDown) {
                        index++;
                        updateDetails();
                    }

                    if (xUp >= xDown) {
                        index--;
                        updateDetails();
                    }
                }

                // Updating data on swipe
                function updateDetails() {
                    if (index < 0) {
                        index++;
                    } else if (pokemonList[index]) {
                        loadDetails(pokemonList[index]).then(function () {
                            name.text(
                                'Name: ' +
                                    pokemonList[index].name
                                        .charAt(0)
                                        .toUpperCase() +
                                    pokemonList[index].name.slice(1)
                            );
                            height.text('Height: ' + pokemonList[index].height);
                            types.html(
                                '<p> Types: ' +
                                    pokemonList[index].types
                                        .map((type) => type.type.name)
                                        .join(', ') +
                                    '</p>'
                            );
                            imgFront.attr(
                                'src',
                                pokemonList[index].imageURLFront
                            );
                            imgFront.attr(
                                'aria-label',
                                'Front image of ' +
                                    pokemonList[index].name
                                        .charAt(0)
                                        .toUpperCase() +
                                    pokemonList[index].name.slice(1)
                            );
                            imgBack.attr(
                                'src',
                                pokemonList[index].imageURLBack
                            );
                            imgBack.attr(
                                'aria-label',
                                'Back image of ' +
                                    pokemonList[index].name
                                        .charAt(0)
                                        .toUpperCase() +
                                    pokemonList[index].name.slice(1)
                            );
                        });
                    } else {
                        index--;
                    }
                }

                //Switch Pokemons on button click
                previousButton.on('click', function () {
                    index--;
                    updateDetails();
                });

                nextButton.on('click', function () {
                    index++;
                    updateDetails();
                });
            });
        });
    }

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
                pokemon.imageURLFront = details.sprites.front_default;
                pokemon.imageURLBack = details.sprites.back_default;
                pokemon.height = details.height;
                pokemon.types = details.types;
            })
            .catch(function (e) {
                hideLoadingMessage();
                console.error(e);
            });
    }

    // Show a loading spinner
    function showLoadingMessage() {
        loadingSpinnerContainer.classList.add('is-visible');
    }

    // Hide the loading spinner
    function hideLoadingMessage() {
        loadingSpinnerContainer.classList.remove('is-visible');
    }

    //Adding background music
    let musicButton = document.querySelector('.music-button');
    let backgroundMusic = document.querySelector('audio');

    musicButton.addEventListener('click', function () {
        if (musicButton.classList.contains('pause')) {
            backgroundMusic.load();
            backgroundMusic.volume = 0.1;
            backgroundMusic.play();
            musicButton.classList.remove('pause');
        } else {
            backgroundMusic.pause();
            musicButton.classList.add('pause');
        }
    });

    return {
        getAll,
        add,
        addListItem,
        loadList,
        loadDetails,
    };
})();

// Print all Pokemons
function printPokemonList(pokemon) {
    pokemonRepository.addListItem(pokemon);
}

// Filter Pokemons by name
function filterByName(pokemonName) {
    return pokemonRepository
        .getAll()
        .filter((name) =>
            name.name.toLowerCase().includes(pokemonName.toLowerCase())
        );
}

// Print all Pokemons
pokemonRepository.loadList().then(function () {
    let searchField = $('#search-field');
    let filteredList = document.querySelector('ul');
    pokemonRepository.getAll().forEach(printPokemonList);

    // Filter Pokemons
    searchField.on('input', function () {
        filteredList.innerHTML = '';
        filterByName(searchField.val()).forEach(printPokemonList);
    });
});

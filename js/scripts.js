// Create Object with a list of Pokemons
let pokemonRepository = (function () {
    let pokemonList = [];
    pokemonList = [
        {
            name: 'Bulbasaur',
            height: 0.7,
            type: ['Grass', 'Poison'],
        },
        {
            name: 'Ivysaur',
            height: 1,
            type: ['Grass', 'Poison'],
        },
        {
            name: 'Venusaur',
            height: 2,
            type: ['Grass', 'Poison'],
        },
        {
            name: 'Charmander',
            height: 0.6,
            types: ['Fire'],
        },
        {
            name: 'Charmeleon',
            height: 1.1,
            type: ['Fire'],
        },
        {
            name: 'Charizard',
            height: 1.7,
            type: ['Fire', 'Flying'],
        },
        {
            name: 'Squirtle',
            height: 0.5,
            types: ['Water'],
        },
        {
            name: 'Wartortle',
            height: 1,
            types: ['Water'],
        },
        {
            name: 'Blastoise',
            height: 1.6,
            types: ['Water'],
        },
    ];

    //write specific elements of pokemonList on the DOM
    document.write('<main>');

    // Get all Pokemons
    function getAll() {
        return pokemonList;
    }

    // Add a Pokemon to the list
    function add(pokemon) {
        let keys = checkKeys(pokemon);
        let lenght = Object.keys(pokemon).length; // Check lenght of the object
        // Check if argument is an object
        if (typeof pokemon !== 'object') {
            console.log('Pokemon is not an Object!');
        } else if (keys === lenght) {
            pokemonList.push(pokemon);
        } else {
            console.log('Wrong Keys');
        }
    }

    // check if the object has the right keys
    function checkKeys(pokemon) {
        let i = 0;
        Object.keys(pokemon).forEach(function (key) {
            if (key == 'name' || key == 'height' || key == 'types') {
                i++;
            } else {
                i--;
            }
        });
        return i;
    }

    return {
        getAll: getAll,
        add: add,
    };
})();

// Print all Pokemons + height
function printPokemonList(pokemon) {
    document.write(pokemon.name + ' (height: ' + pokemon.height + ') ');
    if (pokemon.height > 1.7) {
        document.write("Wow, that's big!" + '<br>');
    } else {
        document.write('<br>');
    }
}

// Log Pokemons to console
function logPokemonList(pokemon) {
    console.log(pokemon.name + ' (height: ' + pokemon.height + ') ');
}

// Filter Pokemons by name
function filterByName(pokemonName) {
    return pokemonRepository
        .getAll()
        .filter((name) => name.name.includes(pokemonName));
}

// Log pokemonRepository
console.log(pokemonRepository.getAll());

// Add a new Pokemon
pokemonRepository.add({ name: 'Pikachu', height: 0.4, types: ['Electric'] });

// Print all Pokemons
pokemonRepository.getAll().forEach(printPokemonList);

// Log filtered Pokemons
filterByName('u').forEach(logPokemonList);

document.write('</main>');

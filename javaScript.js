const arr = JSON.parse(localStorage.getItem('arri')) || [];
console.log(arr.length);

// Function to display movie details in a new tab
function displayMovieDetails(imdbId) {
    // Fetch movie details by IMDb ID
    fetchMovieById(imdbId)
        .then(function(movie) {
            // Clear the container
            const backgroundMoviesCard = document.querySelector(".backgroundMoviesCard");
            backgroundMoviesCard.innerHTML = "";

            // Create a new big card to display movie details
            const bigCard = document.createElement('div');
            bigCard.classList.add('big-card');

            // Create a div for poster
            const posterDiv = document.createElement('div');
            posterDiv.classList.add('poster');
            const posterImage = document.createElement('img');
            posterImage.src = movie.Poster;
            posterDiv.appendChild(posterImage);

            // Create a div for other details
            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add('details');
            const title = document.createElement('h2');
            title.textContent = `${movie.Title} (${movie.Year})`;
            const plot = document.createElement('p');
            plot.innerHTML = `<strong>Plot:</strong> ${movie.Plot}`;
            const director = document.createElement('p');
            director.innerHTML = `<strong>Director:</strong> ${movie.Director}`;
            const actors = document.createElement('p');
            actors.innerHTML = `<strong>Actors:</strong> ${movie.Actors}`;
            detailsDiv.appendChild(title);
            detailsDiv.appendChild(plot);
            detailsDiv.appendChild(director);
            detailsDiv.appendChild(actors);

            // Append poster and other details divs to the big card
            bigCard.appendChild(posterDiv);
            bigCard.appendChild(detailsDiv);

            // Append big card to the container
            backgroundMoviesCard.appendChild(bigCard);
        })
        .catch(function(error) {
            console.error("Error fetching movie details:", error);
        });
}

function displayPoster(array) {
  
    const backgroundMoviesCard = document.querySelector(".backgroundMoviesCard");
    backgroundMoviesCard.innerHTML="";

    for(let i=0;i<array.length;i++){
      
        if (array.length === 0 || !array[i].Poster) {
            console.error("Poster data not available.");
            return;
        }
    
        const imdbIds=array[i].imdbID;
        const PosterImage = array[i].Poster;

       
        const outerCard = document.createElement('div');
        outerCard.classList.add('outer-card');
    
        const card = document.createElement('div');
        card.classList.add('card');
        card.style.backgroundImage = `url(${PosterImage})`;

        card.addEventListener('click', function() {
            displayMovieDetails(imdbIds);
        });
    
        outerCard.appendChild(card);
    
        const button = document.createElement('button');
        button.classList.add('btn');

        if(arr.indexOf(imdbIds)==-1){
            button.textContent = 'Add to favorite';
        }else{
            button.textContent='remove form favorite';
        }
       
        outerCard.appendChild(button);
       
        if (backgroundMoviesCard) {
            backgroundMoviesCard.appendChild(outerCard);
        } else {
            console.error(".backgroundMoviesCard not found.");
        }
    
        button.addEventListener('click', function() {
            if(arr.indexOf(imdbIds)!=-1){
                button.textContent = 'Add to favorite';
                arr.splice(arr.indexOf(imdbIds), 1);
            }else{
                arr.push(imdbIds);
                button.textContent='remove form favorite';
            }
            localStorage.setItem('arri', JSON.stringify(arr));
            console.log(imdbIds);
            console.log(arr.length);
            console.log("Title added to arr:", array[i].Title);
        });

    }
}

function fetchMovies(movieName) {
    return fetch(`https://www.omdbapi.com/?s=${movieName}&apikey=12e7b5bd`)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            return response.Search;
        })
        .catch(function(error) {
            console.log("Error fetching movies:", error);
            return []; // Return an empty array if there's an error
        });
}

// displayPoster(fetchMovies("batman"));

fetchMovies("batman")
    .then(function(arrTemp) {
       displayPoster(arrTemp);
        // Do something with arrTemp here
    })
    .catch(function(error) {
        console.error("Error fetching movies:", error);
    });

    const input = document.querySelector(".searchInput");


    // add event listener to search icon
document.querySelector(".search-icon").addEventListener('click', function() {
    // Get the input value
    const input = document.querySelector(".searchInput");
    
    // Check if the input value has at least 2 characters
    if (input.value.length >= 2) {
        // Call the fetchMovies function with the input value
        fetchMovies(input.value)
        .then(function(arrTemp) {
           displayPoster(arrTemp);
            // Do something with arrTemp here
        })
        .catch(function(error) {
            console.error("Error fetching movies:", error);
        });
    }
});





input.addEventListener('keypress', function(event) {
    const input = document.querySelector(".searchInput");
    if (event.key === 'Enter') {
        fetchMovies(input.value)
            .then(function(array) {
                displayPoster(array);
            });
    }

    if(input.value.length >= 2){
        fetchMovies(input.value)
        .then(function(array) {
            displayAutocomplete(array);
        });
    }
});

// Event listener for clicking on the favorite icon
let favoriteIcon = document.querySelector(".favourite");

favoriteIcon.addEventListener('click', function() {
    displayFavoriteMovies();
});

// Function to display favorite movies
function displayFavoriteMovies() {
    const backgroundMoviesCard = document.querySelector(".backgroundMoviesCard");
    if (!backgroundMoviesCard) {
        console.error(".backgroundMoviesCard not found.");
        return;
    }
    
    backgroundMoviesCard.innerHTML = ""; // Clear the container
    
    for (let i = 0; i < arr.length; i++) {
        const movieId = arr[i];
        fetchMovieById(movieId)
            .then(function(movie) {
                const card = createMovieCard(movie);
                backgroundMoviesCard.appendChild(card);
            })
            .catch(function(error) {
                console.error("Error fetching movie:", error);
            });
    }
}

// Function to fetch movie by ID
function fetchMovieById(movieId) {
    return fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=12e7b5bd`)
        .then(function(response) {
            return response.json();
        });
}

// Function to create a movie card
function createMovieCard(movie) {
    const outerCard = document.createElement('div');
    outerCard.classList.add('outer-card');

    const card = document.createElement('div');
    card.classList.add('card');
    card.style.backgroundImage = `url(${movie.Poster})`;

    outerCard.appendChild(card);

    const button = document.createElement('button');
    button.classList.add('btn');
    button.textContent = arr.includes(movie.imdbID) ? 'Remove from Favorite' : 'Add to Favorite';

    outerCard.appendChild(button);

    card.addEventListener('click',function(){
        displayMovieDetails(movie.imdbID);
    })

    button.addEventListener('click', function() {
        toggleFavorite(movie.imdbID);
    });

    return outerCard;
}

// Function to toggle favorite status
function toggleFavorite(movieId) {
    const index = arr.indexOf(movieId);
    if (index !== -1) {
        arr.splice(index, 1);
    } else {
        arr.push(movieId);
    }
    localStorage.setItem('arr', JSON.stringify(arr));
    displayFavoriteMovies();
}


const searchInput = document.querySelector('.searchInput');

searchInput.addEventListener('input', function() {
    const inputValue =  searchInput.value.trim();
    if (inputValue.length >= 2) {
        fetchMovies(inputValue)
            .then(function(array) {
                displayAutocomplete(array);
            })
            .catch(function(error) {
                console.error("Error fetching autocomplete suggestions:", error);
                hideAutocomplete();
            });
    } else {
        hideAutocomplete();
    }
});



function displayAutocomplete(array) {
    const autocompleteContainer = document.querySelector('.autocomplete-container');
    if (!autocompleteContainer) {
        console.error(".autocomplete-container not found.");
        return;
    }
    autocompleteContainer.innerHTML = '';

    if (!array || array.length === 0) {
        hideAutocomplete();
        return;
    }

    for (let i = 0; i < array.length; i++) {
        const movie = array[i];
        const movieTitle = movie.Title;
        const moviePoster = movie.Poster;
        const item = document.createElement('div');
        item.classList.add('autocomplete-item');

        // Create a container for movie details
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        // Create a div for movie poster
        const posterDiv = document.createElement('div');
        posterDiv.classList.add('poster-small');
        const posterImage = document.createElement('img');
        posterImage.src = moviePoster;
        posterDiv.appendChild(posterImage);

        // Create a div for movie title
        const titleDiv = document.createElement('div');
        titleDiv.classList.add('movie-title');
        titleDiv.textContent = movieTitle;

        // Append poster and title to movie container
        movieContainer.appendChild(posterDiv);
        movieContainer.appendChild(titleDiv);

        // Add click event listener to select movie
        movieContainer.addEventListener('click', () => {
            searchInput.value = movieTitle;
            hideAutocomplete();
        });

        // Append movie container to autocomplete item
        item.appendChild(movieContainer);

        // Append item to autocomplete container
        autocompleteContainer.appendChild(item);
    }

    autocompleteContainer.style.display = 'block';
}

function hideAutocomplete() {
    const autocompleteContainer = document.querySelector('.autocomplete-container');
    if (autocompleteContainer) {
        autocompleteContainer.style.display = 'none';
    }
}

document.addEventListener('click', function(event) {
    const autocompleteContainer = document.querySelector('.autocomplete-container');
    if (!autocompleteContainer.contains(event.target) && event.target !== searchInput) {
        hideAutocomplete();
    }
});


document.querySelector(".home").addEventListener('click',function(){
    fetchMovies("batman")
    .then(function(arrTemp) {
       displayPoster(arrTemp);
        // Do something with arrTemp here
    })
    .catch(function(error) {
        console.error("Error fetching movies:", error);
    });

    const input = document.querySelector(".searchInput");

})


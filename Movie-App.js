// Get DOM elements
let movieInput = document.querySelector("#movieInput");
let searchBtn = document.querySelector("#searchBtn");
let moviesContainer = document.querySelector("#moviesContainer");
let modal = document.querySelector("#modal");


async function getMovies() {

    let movie = movieInput.value;

    if (movie === "") {
        alert("Please enter a movie name");
        return;
    }

    localStorage.setItem("lastMovie", movie);

    let movieUrl = `https://www.omdbapi.com/?apikey=96f1c2f8&s=${movie}`;

    moviesContainer.innerHTML = `
    <div class="loading">
    ⏳ Loading movies...
    </div>
    `;
    try {

        let response = await fetch(movieUrl);

        if (!response.ok) {
            throw new Error("API Error");
        }

        let data = await response.json();

        if (data.Response === "False") {
            moviesContainer.innerHTML = `<div class="notFount">Movies not found</div>`;
            return;
        }

        moviesContainer.innerHTML = "";

        for (let movie of data.Search) {
            let detailUrl = `https://www.omdbapi.com/?apikey=96f1c2f8&i=${movie.imdbID}`;
            let detailResponse = await fetch(detailUrl);
            let detailData = await detailResponse.json();

            let poster = movie.Poster !== "N/A"
                ? movie.Poster
                : "./NotAvailable.png";

            let card = createMovieCard(
                movie,
                poster,
                detailData
            );

            moviesContainer.append(card);
        };

    } catch (error) {

        moviesContainer.innerHTML = `
        <div class="error-box">
            ❌ Failed to load movies
            <br>
            Please try again later
        </div>
    `;

        console.log(error);
    }
}

let savedMovie = localStorage.getItem("lastMovie");

if (savedMovie) {
    movieInput.value = savedMovie;
    getMovies();
}

function createMovieCard(movie, poster, detailData) {
    let movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    movieCard.innerHTML = `
    <img src="${poster}">    
    <h2>${movie.Title}</h2>
    <p>Year: ${movie.Year}</p>
    <p>⭐ Rating: ${detailData.imdbRating}</p>            
    <p>🎭 Genre: ${detailData.Genre}</p>
    <p>🎬 Director: ${detailData.Director}</p>
    <p>⏱ Runtime: ${detailData.Runtime}</p>           
    `;

    movieCard.addEventListener("click", function () {
        showMovieDetails(detailData);
    });

    return movieCard;

}

function showMovieDetails(detailData) {

    modal.style.display = "flex";

    document.body.style.overflow = "hidden";

    modal.innerHTML = `
    <div class="modal-content">

        <span class="close">❌</span>

        <h2>${detailData.Title}</h2>

        <img src="${detailData.Poster !== "N/A" ? detailData.Poster : "./cat.jpg"}">

        <p>📝 ${detailData.Plot}</p>

        <p>🎭 Genre: ${detailData.Genre}</p>

        <p>🎬 Director: ${detailData.Director}</p>

        <p>👥 Actors: ${detailData.Actors}</p>

        <p>🏆 Awards: ${detailData.Awards}</p>

    </div>
    `;


    let closeBtn = modal.querySelector(".close");


    closeBtn.addEventListener("click", function () {

        modal.style.display = "none";

        document.body.style.overflow = "auto";

    });

}
modal.addEventListener("click", function (event) {

    if (event.target === modal) {

        modal.style.display = "none";

        document.body.style.overflow = "auto";

    }

});
// Events

searchBtn.addEventListener("click", function () {
    getMovies();
});

movieInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        getMovies();
    }
});
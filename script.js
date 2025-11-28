// -------------------------------
// TMDb API CONFIG
// -------------------------------
const API_KEY = "eab1db37e64756083c66dc8cd78fa47c"; 
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_PATH = "https://image.tmdb.org/t/p/w500";

// -------------------------------
// ELEMENTS
// -------------------------------
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResults = document.getElementById("searchResults");
const searchSection = document.getElementById("searchSection");

const topMoviesRow = document.getElementById("topMovies");
const hollywoodMoviesRow = document.getElementById("hollywoodMovies");
const bollywoodMoviesRow = document.getElementById("bollywoodMovies");

// Popup elements
const popupOverlay = document.getElementById("popupOverlay");
const popupContent = document.getElementById("popupContent");
const popupClose = document.getElementById("popupClose");


// Hide search section initially
searchSection.style.display = "none";


// -------------------------------
// Fetch Movies
// -------------------------------
async function fetchMovies(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data.results;
    } catch (error) {
        console.error("API Fetch Error:", error);
        return [];
    }
}


// -------------------------------
// Render Movie Cards
// -------------------------------
function renderMovies(movieArray, container) {
    container.innerHTML = "";

    movieArray.forEach(movie => {
        if (!movie.poster_path) return;

        const card = document.createElement("div");
        card.classList.add("movie-card");

        card.innerHTML = `
            <img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p class="rating-year">⭐ ${movie.vote_average.toFixed(1)} | ${movie.release_date ? movie.release_date.substring(0, 4) : "N/A"}</p>
            </div>
        `;

        // Open popup on click
        card.addEventListener("click", () => openPopup(movie));

        container.appendChild(card);
    });
}


// -------------------------------
// POPUP FUNCTIONS
// -------------------------------
function openPopup(movie) {
    popupContent.innerHTML = `
        <h2>${movie.title}</h2>
        <img src="${IMG_PATH + movie.poster_path}" class="popup-img"/>
        <p><strong>Rating:</strong> ⭐ ${movie.vote_average.toFixed(1)}</p>
        <p><strong>Release Date:</strong> ${movie.release_date || "Unknown"}</p>
        <p><strong>Overview:</strong> ${movie.overview || "No description available."}</p>
    `;

    popupOverlay.style.display = "flex";
    document.body.style.overflow = "hidden"; // stop background scroll
}

popupClose.addEventListener("click", closePopup);
popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) closePopup();
});

function closePopup() {
    popupOverlay.style.display = "none";
    document.body.style.overflow = "auto";
}


// -------------------------------
// SEARCH FUNCTION
// -------------------------------
async function searchMovie() {
    const query = searchInput.value.trim();

    if (query === "") {
        searchInput.value = "";
        searchInput.placeholder = "Search a movie first!";
        return;
    }

    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`;

    const movies = await fetchMovies(url);
    renderMovies(movies, searchResults);

    searchSection.style.display = "block";
}

searchBtn.addEventListener("click", searchMovie);

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchMovie();
});


// -------------------------------
// LOAD DEFAULT MOVIES
// -------------------------------
async function loadDefaultMovies() {
    const topMovies = await fetchMovies(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
    const hollywood = await fetchMovies(`${BASE_URL}/discover/movie?with_original_language=en&api_key=${API_KEY}`);
    const bollywood = await fetchMovies(`${BASE_URL}/discover/movie?with_original_language=hi&api_key=${API_KEY}`);

    renderMovies(topMovies.slice(0, 20), topMoviesRow);
    renderMovies(hollywood.slice(0, 20), hollywoodMoviesRow);
    renderMovies(bollywood.slice(0, 20), bollywoodMoviesRow);
}

loadDefaultMovies();

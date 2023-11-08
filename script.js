const searchInput = document.getElementById('searchInput');
const form = document.getElementById('form');
const moviesWrapper = document.getElementById('moviesContainer');
const sortSelect = document.getElementById('sortSelect');
const paginationElement = document.getElementById('pagination');
let currentPage = 1;
const moviesPerPage = 20;
let currentSort = 'popularity.desc';
let allMovies = [];
let totalPages = 20;
let apiKey = 'f42514c3733d0e3a5ec73da5be9a3374';
const discoverUrl = 'https://api.themoviedb.org/3/discover/movie';
const searchUrl = 'https://api.themoviedb.org/3/search/movie';
const imageUrl = 'https://image.tmdb.org/t/p/w500';

window.addEventListener('load', () => {
    currentPage = 1;
    allMovies = [];
    moviesWrapper.innerHTML = '';
    fetchAndStoreMovies(`${discoverUrl}?include_adult=true&include_video=true&language=en-US&page=${currentPage}&sort_by=popularity.desc&api_key=${apiKey}`);
});

async function fetchAndStoreMovies(url) {
    try {
        let response = await fetch(url);
        if (!response.ok) {
            console.log(`Request failed with status ${response.status}`);
        }
        let data = await response.json();
        allMovies = data.results;
        allMovies = sortMovies(allMovies);
        renderMovies();
        updatePagination();
    } catch (error) {
        console.error(error);
    }
}

function renderMovies() {
    moviesWrapper.innerHTML = '';

    allMovies.forEach((movie) => {
        const { backdrop_path, original_title, overview, vote_average } = movie;

        const card = document.createElement('div');
        card.classList.add('card');
        const descWrapper = document.createElement('div');
        descWrapper.classList.add('descriptionWrapper');

        const image = document.createElement('img');
        image.src = imageUrl + backdrop_path;
        image.alt = overview;

        const title = document.createElement('h2');
        title.textContent = original_title;

        const description = document.createElement('p');
        const trimmedOverview = overview.substring(0, 100);
        description.textContent = trimmedOverview;

        const readMoreButton = document.createElement('button');
        readMoreButton.textContent = 'Read More';
        readMoreButton.addEventListener('click', () => {
            description.textContent = overview;
            readMoreButton.style.display = 'none';
        });

        const rating = document.createElement('span');
        rating.textContent = vote_average;

        if (vote_average <= 4) {
            card.style.backgroundColor = 'red';
        } else if (vote_average >= 7.5) {
            card.style.backgroundColor = 'green';
        } else {
            card.style.backgroundColor = 'yellow';
        }

        card.appendChild(image);
        card.appendChild(title);
        descWrapper.appendChild(description);
        descWrapper.appendChild(readMoreButton);
        card.appendChild(rating);

        card.appendChild(descWrapper)
        moviesWrapper.appendChild(card);
    });
}

function updatePagination() {
    paginationElement.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        if (i === currentPage) {
            pageButton.classList.add('active');
        }

        pageButton.addEventListener('click', () => {
            currentPage = i;
            fetchAndStoreMovies(`${discoverUrl}?include_adult=true&include_video=true&language=en-US&page=${currentPage}&sort_by=${currentSort}&api_key=${apiKey}`);
        });
        paginationElement.appendChild(pageButton);
    }
}

function sortMovies(movies) {
    switch (currentSort) {
        case 'rating.asc':
            return movies.slice().sort((a, b) => a.vote_average - b.vote_average);
        case 'rating.desc':
            return movies.slice().sort((a, b) => b.vote_average - a.vote_average);
        default:
            return movies;
    }
}

sortSelect.addEventListener('change', (event) => {
    currentSort = event.target.value;
    currentPage = 1;
    fetchAndStoreMovies(`${discoverUrl}?include_adult=true&include_video=true&language=en-US&page=${currentPage}&sort_by=${currentSort}&api_key=${apiKey}`);
});

form.addEventListener('submit', async(event) => {
    event.preventDefault();
    const searchValue = searchInput.value.trim().toLowerCase();
    currentPage = 1;
    fetchAndStoreMovies(`${searchUrl}?include_adult=true&include_video=true&language=en-US&page=${currentPage}&query=${searchValue}&api_key=${apiKey}`);
    form.reset();
});
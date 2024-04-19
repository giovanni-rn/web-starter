// Get DOM elements
const movieTitle = document.querySelector('#search-query');
const submitButton = document.querySelector('#search-submit');
const resultsList = document.querySelector('#list-movies');
const resultInfo = document.querySelector("#list-heading")

/**
 * Search movies by title
 * @returns {object[]} List of found movies
 */
const fetchMovies = async () => {
    // Settings for API
    const url = `https://imdb8.p.rapidapi.com/title/v2/find?title=${movieTitle.value}&limit=20&sortArg=moviemeter%2Casc`;
    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": "33a38a48e2msh345936a2215c570p1a003cjsn277d5a16ce04",
            "X-RapidAPI-Host": "imdb8.p.rapidapi.com",
        },
    };
    // Response from API
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result.results
    } catch (error) {
        console.error(error);
        return []
    }
};

/**
 * Display the GIF until the results are fetched
 * @param {boolean} status 
 */
const loadingAnimation = (status) => {
    if (status) {
        resultsList.innerHTML = ""
        movieTitle.disabled = true
        submitButton.disabled = true
        const loadingGif = document.createElement("img")
        loadingGif.src = "assets/loading.gif"
        loadingGif.height = 50
        loadingGif.width = 50
        resultsList.appendChild(loadingGif)
    } else {
        resultsList.innerHTML = ""
        movieTitle.disabled = false
        submitButton.disabled = false
    }
}

/**
 * Add a new list item for each found movie
 */
const displayResults = async () => {
    loadingAnimation(true)
    const movies = await fetchMovies()
    resultInfo.innerText = `${movies.length} results for \"${movieTitle.value}\"`
    if (movies.length > 0) loadingAnimation(false)
    // Render each movie item
    for (const movie of movies) {
        const item = document.createElement("li")
        // Link
        const url = document.createElement("a")
        url.href = `https://www.imdb.com${movie.id}`
        url.target = "_blank"
        item.appendChild(url)
        // Title
        const title = document.createElement("h4")
        title.innerText = movie.title
        url.appendChild(title)
        // Cover image
        const cover = document.createElement("img")
        cover.src = movie.image.url
        url.appendChild(cover)
        // Release date
        const year = document.createElement("p")
        year.innerText = movie.year
        url.appendChild(year)
        // Attach movie item
        resultsList.appendChild(item)
    }
}

// Start researching after checking the input
submitButton.addEventListener('click', (e) => {
    e.preventDefault()
    if (movieTitle.value != "") displayResults()
    else alert("Input is empty !")
})
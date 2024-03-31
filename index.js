const initialMoviesIds = [
  82, 63, 17861, 37700, 335, 527, 768, 5, 582, 179, 379, 4729,
];

async function getMovieData(movieId, movieName) {
  try {
    const res = movieId
      ? await fetch(`https://api.tvmaze.com/shows/${movieId}`)
      : await fetch(`https://api.tvmaze.com/search/shows?q=${movieName}`);

    const data = await res.json();

    return data;
  } catch (err) {
    throw new Error(err);
  }
}

async function generateCard(movieId, parentEle, data) {
  let movieData = data;

  try {
    if (!movieData) {
      movieData = await getMovieData(movieId);
    }
  } catch (err) {
    parentEle.innerText = "No results found";
    throw new Error(err);
  }

  const cardContainer = document.createElement("div");
  cardContainer.classList.add(
    "card-container",
    "col-6",
    "col-md-4",
    "col-lg-3",
    "col-xxl-2",
    "my-0",
    "px-0",
    "position-relative",
    "overflow-hidden"
  );

  cardContainer.addEventListener(
    "click",
    () => (window.location.href = `./episodes.html?id=${movieData.id}`)
  );

  const cardContainerImg = document.createElement("img");
  cardContainerImg.setAttribute("src", movieData.image?.medium);
  cardContainerImg.classList.add("w-100", "rounded");

  const cardContainerContent = document.createElement("div");
  cardContainerContent.classList.add(
    "text-white",
    "position-absolute",
    "bottom-0",
    "px-2",
    "rounded"
  );
  const cardHeading = document.createElement("h3");
  cardHeading.textContent = movieData.name.split(" ").slice(0, 3).join(" ");
  cardHeading.classList.add("fs-6");
  const cardGenres = document.createElement("span");
  cardGenres.classList.add("fs-7");
  cardGenres.textContent =
    movieData.genres.slice(0, 2)?.join(" | ") || "No Info";
  const cardAverageRating = document.createElement("p");
  cardAverageRating.classList.add("mb-1");
  cardAverageRating.textContent = movieData.rating?.average || "No Info";

  cardContainerContent.append(cardHeading, cardGenres, cardAverageRating);
  cardContainer.append(cardContainerImg, cardContainerContent);
  parentEle.append(cardContainer);
}

const cardsSection = document.querySelector(".movies-cards");

initialMoviesIds.forEach((movieId) => generateCard(movieId, cardsSection));

const searchInput = document.querySelector("input");
searchInput.addEventListener("input", async (e) => {
  const movieData = e.target.value
    ? await getMovieData(undefined, e.target.value.toLowerCase())
    : location.reload();
  cardsSection.innerHTML = "";
  movieData.forEach((movie) => {
    generateCard(null, cardsSection, movie.show);
  });
});

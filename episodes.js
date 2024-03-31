const urlParams = new URLSearchParams(window.location.search);
const showId = urlParams.get("id");

const cardsContainer = document.querySelector("main div.row");
generateEpisodeCards(showId, cardsContainer);

const dropDownMenu = document.querySelector("ul");
generateDropDownItems(showId, dropDownMenu);

async function getEpisodesData(showId) {
  try {
    const res = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error(err);
  }
}

async function generateDropDownItems(showId, parentEle) {
  const episodesData = await getEpisodesData(showId);

  //! Generating dropdown items(HTML)

  episodesData.forEach((episode) => {
    const dropDownItem = document.createElement("li");
    const dropDownItemLink = document.createElement("a");
    dropDownItemLink.classList.add("dropdown-item", "fs-7");
    dropDownItemLink.setAttribute("href", "#");
    dropDownItemLink.textContent = `S${episode.season}-E${episode.number}  ${episode.name}`;

    dropDownItem.append(dropDownItemLink);
    parentEle.append(dropDownItem);
  });

  //!filtering & regenerating episodes by dropdown items

  const dropDownItems = document.querySelectorAll(".dropdown-item");
  dropDownItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      if (e.target.innerText !== "All Episodes") {
        const filteredData = episodesData.filter((episode) => {
          return e.target.innerText.includes(episode.name);
        });
        cardsContainer.innerHTML = "";
        document.querySelector("button").innerText = e.target.innerText;
        generateEpisodeCards(null, cardsContainer, filteredData);
      } else {
        cardsContainer.innerHTML = "";
        document.querySelector("button").innerText = "All Episodes";
        generateEpisodeCards(showId, cardsContainer);
      }
    });
  });
}

async function generateEpisodeCards(showId, parentEle, data) {
  const episodesData = data ? data : await getEpisodesData(showId);

  //! generating initial cards
  episodesData.forEach((episode) => {
    const episodeCard = document.createElement("div");
    episodeCard.classList.add(
      "episode-card",
      "col-6",
      "col-sm-4",
      "col-lg-3",
      "p-0",
      "text-white"
    );
    const episodeCardImgContainer = document.createElement("div");
    episodeCardImgContainer.classList.add("h-176");
    const episodeCardImg = document.createElement("img");
    episodeCardImg.setAttribute("src", episode.image?.medium);
    episodeCardImg.classList.add("w-100");
    const episodeCardContent = document.createElement("div");
    episodeCardContent.classList.add("p-3", "pb-5", "position-relative");
    const episodeTitle = document.createElement("h3");
    episodeTitle.classList.add("text-white", "fs-6");
    episodeTitle.textContent = `S${episode.season}-E${episode.number}  ${episode.name}`;
    const episodeLink = document.createElement("a");
    episodeLink.setAttribute("href", episode.url);
    episodeLink.classList.add(
      "position-absolute",
      "bottom-0",
      "end-0",
      "px-3",
      "py-1"
    );
    const playIcon = document.createElement("i");
    playIcon.classList.add("bi", "bi-play-circle-fill", "text-success", "fs-2");

    episodeLink.append(playIcon);
    episodeCardImgContainer.append(episodeCardImg);
    episodeCardContent.append(episodeTitle, episodeLink);
    episodeCard.append(episodeCardImgContainer, episodeCardContent);
    parentEle.append(episodeCard);
  });

  //! episode's summary
  const episodeCardsTitles = document.querySelectorAll(".episode-card h3");
  episodeCardsTitles.forEach((title) => {
    title.addEventListener("mouseover", (e) => {
      const movie = episodesData.filter((movie) =>
        title.innerText.includes(movie.name)
      )[0];

      title.parentElement.previousElementSibling.innerHTML = movie.summary;
      title.parentElement.previousElementSibling.classList.add(
        "overflow-hidden",
        "fs-7",
        "p-3"
      );
    });

    title.addEventListener("mouseout", (e) => {
      const movie = episodesData.filter((movie) =>
        title.innerText.includes(movie.name)
      )[0];

      title.parentElement.previousElementSibling.innerHTML = `<img src="${movie.image?.medium}" class="w-100"/>`;
      title.parentElement.previousElementSibling.classList.remove(
        "overflow-hidden",
        "fs-7",
        "p-3"
      );
    });
  });
}

const searchBar = document.getElementById("search-bar"); //search bar element
const searchBarValue = document.getElementById("search-value"); //input of search bar
const searchBarMealsList = document.createElement("ul"); // list element for elastic search bar
const searchInput = window.location.search; //gets the  query keyword of search
const mealCardsList = document.getElementById("meals-list"); //list element of meal Cards
const searchBtn = document.getElementById("search-btn"); //search button

const mealCardsWrapper = document.getElementById("meal-cards-wrapper");
// ------------------------------------------------------------------------>

// #ADD TO FAVOURITES
const buttonClick = function (a, url) {
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("NETWORK RESPONSE ERROR");
      }
    })
    .then((data) => {
      obj = data;
    })
    .catch((error) => {
      console.error("FETCH ERROR:", error);
    });
  const { meals } = obj;
  for (elem of meals) {
    if (elem["idMeal"] == a) {
      localStorage.setItem("mealsDesc", JSON.stringify(elem));
    }
  }
};

const favouritesMealArray = [];

const addToFavourites = function (id) {
  favBtn = document.querySelector('[fav-data-id = "' + id + '"]');

  favBtn.innerText = "REMOVE FROM FAV";
  fetch(SEARCH_MEAL_API_URL)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("NETWORK RESPONSE ERROR");
      }
    })
    .then((data) => {
      obj = data;
    })
    .catch((error) => {
      console.error("FETCH ERROR:", error);
    });

  const { meals } = obj;
  let isPresentAlready = -1;
  for (elem of meals) {
    if (elem["idMeal"] == id) {
      const favourites = getFavourites();
      favourites.forEach((e) => {
        if (e["idMeal"] == id) {
          isPresentAlready = 0;
        }
      });
      if (isPresentAlready == -1) {
        favouritesMealArray.push(elem);
        localStorage.setItem("favourites", JSON.stringify(favouritesMealArray));
      } else {
        deletefromStorage(id);
      }
    }
  }
};

function getFavourites() {
  let favourites = [];
  const isPresent = localStorage.getItem("favourites");
  if (isPresent) {
    favourites = JSON.parse(isPresent);
  }
  return favourites;
}

function deletefromStorage(id) {
  const favourites = getFavourites();
  res = 0;
  favourites.forEach((elem) => {
    if (elem["idMeal"] == id) {
      res = favourites.indexOf(elem);
    }
  });

  if (res != -1) {
    favBtn = document.querySelector('[fav-data-id = "' + id + '"]');
    favBtn.innerText = "ADD TO FAVOURITES";
    favourites.splice(res, 1);
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }
}

// <-----------------------------------------------------------------------

// ------------------------------------------------------------------------>

//#ADD TO SEARCH LIST

// empty the search bar list when clicked outside
window.addEventListener("click", () => {
  while (searchBarMealsList.firstChild) {
    searchBarMealsList.removeChild(searchBarMealsList.firstChild);
  }
});

// event listener  to listen dynamic input
searchBarValue.addEventListener("keyup", (e) => {
  while (searchBarMealsList.firstChild) {
    searchBarMealsList.removeChild(searchBarMealsList.firstChild);
  }
  API_SEARCH_BAR_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  let searchValueInput = document.getElementById("search-value").value;
  API_SEARCH_BAR_URL += searchValueInput;
  populateSearchList(API_SEARCH_BAR_URL);
  searchBar.append(searchBarMealsList);
});

// function to add list items of dynamic input to search bar list
async function populateSearchList(url) {
  await fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("NETWORK RESPONSE ERROR");
      }
    })
    .then((data) => {
      obj1 = data;
    })
    .catch((error) => {
      console.error("FETCH ERROR:", error);
    });

  let { meals } = obj1;

  a = url.substring(url.indexOf("=") + 1);
  a += "";

  if (obj1 != null) {
    for (element of meals) {
      var searchListItem = document.createElement("li");
      searchListItem.className = "searchListItem";
      searchListItem.innerHTML = `<a href = "javascript:void(0)" onclick= "fetchById(${element["idMeal"]}) " >${element["strMeal"]}</a>`;
    }
    searchBarMealsList.append(searchListItem);
  }
}

// <------------------------------------------------------------------------

// ------------------------------------------------------------------------>

//#ADD TO MEALS CARDS

let SEARCH_MEAL_API_URL =
  "https://www.themealdb.com/api/json/v1/1/search.php?s=" +
  searchInput.substring(8) +
  "#cards-page";

// function to fetch the searched query  from api
const dev = (async function () {
  fetch(SEARCH_MEAL_API_URL)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("NETWORK RESPONSE ERROR");
      }
    })
    .then((data) => {
      obj = data;
      generateMealCard(obj);
    })
    .catch((error) => {
      console.error("FETCH ERROR:", error);
    });
})();

// function to generate cards of meals
function generateMealCard(obj) {
  let { meals } = obj;
  if (meals == null) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<h1>Uh Oh!! We don't have these Recipes yet</h1>`;
    mealCardsList.append(listItem);
    return;
  } else {
    meals.forEach((element) => {
      addListItemtoCard(element);
    });
  }
}

// function to add list item to dom
function addListItemtoCard(element) {
  const listItem = document.createElement("li");
  listItem.className = "booking-card";
  listItem.style.backgroundImage = `url(${element["strMealThumb"]})`;

  const favourites = getFavourites();
  let isFavourite = "ADD TO FAVOURITES";
  for (elem of favourites) {
    if (elem["idMeal"] == element["idMeal"]) {
      isFavourite = "REMOVE FROM FAV";
    }
  }
  listItem.innerHTML = `
            <div class="book-container">
              <div class="content">
                <button class="btn" onclick = addToFavourites(${element["idMeal"]}) id = "fav-btn" fav-data-id = ${element["idMeal"]}>${isFavourite}</button>
              </div>
            </div>
            <div class="informations-container">
              <h2 class="title">
              ${element["strMeal"]}
              </h2>
              <p class="sub-title">${element["strCategory"]}</p>
              <p class="price">
              <div class="more-information">
                <div class="info-and-date-container">
                  <div class="box info">
                    <svg
                      class="icon"
                      style="width: 24px; height: 24px"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"
                      />
                    </svg>
                    <p ><a href = "javascript:void(0)" onclick= "fetchById(${element["idMeal"]})" data-id =${element["idMeal"]}  id="desc-btn" >View Recipe</a></p>
                  </div>
                  <div class="box date">
                   <svg class ="icon"xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="24px" height="24px"><linearGradient id="PgB_UHa29h0TpFV_moJI9a" x1="9.816" x2="41.246" y1="9.871" y2="41.301" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f44f5a"/><stop offset=".443" stop-color="#ee3d4a"/><stop offset="1" stop-color="#e52030"/></linearGradient><path fill="url(#PgB_UHa29h0TpFV_moJI9a)" d="M45.012,34.56c-0.439,2.24-2.304,3.947-4.608,4.267C36.783,39.36,30.748,40,23.945,40	c-6.693,0-12.728-0.64-16.459-1.173c-2.304-0.32-4.17-2.027-4.608-4.267C2.439,32.107,2,28.48,2,24s0.439-8.107,0.878-10.56	c0.439-2.24,2.304-3.947,4.608-4.267C11.107,8.64,17.142,8,23.945,8s12.728,0.64,16.459,1.173c2.304,0.32,4.17,2.027,4.608,4.267	C45.451,15.893,46,19.52,46,24C45.89,28.48,45.451,32.107,45.012,34.56z"/><path d="M32.352,22.44l-11.436-7.624c-0.577-0.385-1.314-0.421-1.925-0.093C18.38,15.05,18,15.683,18,16.376	v15.248c0,0.693,0.38,1.327,0.991,1.654c0.278,0.149,0.581,0.222,0.884,0.222c0.364,0,0.726-0.106,1.04-0.315l11.436-7.624	c0.523-0.349,0.835-0.932,0.835-1.56C33.187,23.372,32.874,22.789,32.352,22.44z" opacity=".05"/><path d="M20.681,15.237l10.79,7.194c0.689,0.495,1.153,0.938,1.153,1.513c0,0.575-0.224,0.976-0.715,1.334	c-0.371,0.27-11.045,7.364-11.045,7.364c-0.901,0.604-2.364,0.476-2.364-1.499V16.744C18.5,14.739,20.084,14.839,20.681,15.237z" opacity=".07"/><path fill="#fff" d="M19,31.568V16.433c0-0.743,0.828-1.187,1.447-0.774l11.352,7.568c0.553,0.368,0.553,1.18,"0,1.549	l-11.352,7.568C19.828,32.755,19,32.312,19,31.568z"/></svg> <a href = "${element["strYoutube"]}" target="_blank" ><p>Watch Tutorial</p></a>
                  </div>
                 </div>
                  </div>
                <p class ="disclaimer"></p>
                  </div>`;

  mealCardsList.append(listItem);
}

const fetchById = (id) => {
  url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id;
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("NETWORK RESPONSE ERROR");
      }
    })
    .then((data) => {
      obj = data;
      setToLocal(obj);
    })
    .catch((error) => {
      console.error("FETCH ERROR:", error);
    });
};

function setToLocal(obj) {
  const a = obj.meals;
  localStorage.setItem("mealsDesc", JSON.stringify(a[0]));
  window.location.href = "./recipe.html";
}

// <------------------------------------------------------------------------

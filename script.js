const searchBtn = document.getElementById('search');
const submitBtn = document.getElementById('submit');
const randomBtn = document.getElementById('random');
const mealsElement = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const singleMealElement = document.getElementById('single-meal');

//Search meal
function searchMeal(e) {
  e.preventDefault();

  //clear single meal
  singleMealElement.innerHTML = '';

  // get search term
  const term = search.value;

  // check for emtpy and get the meals
  if (term.trim()) {
    fetchMeal(term);
  } else {
    alert('Please enter a search term');
  }
}

// Fetch meal from API (by user term)
function fetchMeal(term) {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    .then((res) => res.json())
    .then((data) => {
      resultHeading.innerHTML = `<h2>Search results for '${term}'</h2>`;

      if (data.meals === null) {
        resultHeading.innerHTML = `<p>There are no serach results</p>`;
      } else {
        mealsElement.innerHTML = data.meals
          .map(
            (meal) => `
                <div class="meal">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <div class="meal-info" data-mealID="${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
            `
          )
          .join('');
      }
    });

  // clear serch text
  search.value = '';
}

//Fetch meal by ID
function getMealByID(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

// Fetch random meal from API
function randomMeal() {
  //clear meals and heading
  mealsElement.innerHTML = '';
  resultHeading.innerHTML = '';

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

// add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  singleMealElement.innerHTML = `
    <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <div class="single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        </div>
        <div class="main">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
                ${ingredients
                  .map((ingredient) => `<li>${ingredient}</li>`)
                  .join('')}
            </ul>
        </div>
    </div> 
  `;
}

// Event listeners

submitBtn.addEventListener('submit', searchMeal);

// get random meal
randomBtn.addEventListener('click', randomMeal);

// Get mealID from the specific meal that user clicked
mealsElement.addEventListener('click', (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');

    getMealByID(mealID);
  }
});

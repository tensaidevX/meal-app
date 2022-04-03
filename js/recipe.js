const main = document.getElementsByTagName("main"); //layout element

const leftContainer = document.getElementsByClassName("left-container"); //left container of the body
const rightContainer = document.getElementsByClassName("right-container"); //right container of the body

const dropdownIngredients = document.getElementById("section-dropdown"); //ingredients dropdown
const ingredientList = document.createElement("ul");

const mealdesc = localStorage.getItem("mealsDesc"); //get mealDescription from local Storage
const mealDescription = JSON.parse(mealdesc);

// add Instructions of meal to DOM
const instructions = document.createElement("div");
instructions.id = "instruction-wrapper";
instructions.innerHTML = `
<h1>${mealDescription["strMeal"]}</h1>
<div id = "instructions">${mealDescription["strInstructions"]}</div>`;
leftContainer[0].append(instructions);

//add image of recipe to DOM
rightContainer[0].innerHTML = `<img src = "${mealDescription["strMealThumb"]}"  id ="thumbnail"/>`;

// Add ingredients and measure to DOM
let strIngredient = [];
for (i = 1; i <= 20; i++) {
  strIngredient.push("strIngredient" + i);
}
let strMeasure = [];
for (i = 1; i <= 20; i++) {
  strMeasure.push("strMeasure" + i);
}
i = 0;
while (i <= 20) {
  a = strIngredient[i];
  b = strMeasure[i];

  if (mealDescription[a] == "" || mealDescription[a] == undefined) {
    i++;
    continue;
  }

  const ingredientListItem = document.createElement("li");
  ingredientListItem.innerHTML = `${mealDescription[a]} = ${mealDescription[b]}`;

  ingredientList.append(ingredientListItem);
  i++;
}

dropdownIngredients.append(ingredientList);

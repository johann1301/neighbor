document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("test JS imported successfully!");
  },
  false
);

// Sign in / Sign up transition click event
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

 function filterCategory(e) {
  const category = document.querySelectorAll(".list div"); // select all category divs
  let filter = e.target.dataset.filter; // grab the value in the event target's data-filter attribute
  category.forEach(category => {
    category.classList.contains(filter) // does the ad have the filter in its class list?
    ? category.classList.remove('hidden') // if yes, make sure .hidden is not applied
    : category.classList.add('hidden'); // if no, apply .hidden
  });
};
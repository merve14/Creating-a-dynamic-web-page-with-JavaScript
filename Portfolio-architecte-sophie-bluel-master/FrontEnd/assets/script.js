const gallery = document.querySelector(".gallery");
const buttons = document.querySelector(".buttons");
let works = [];
let token = null;
const blackBar = document.getElementById("blackBar");
const btnLogin = document.querySelector("li.login");
const btnModifier = document.querySelector("div.icon-et-modifier");

console.log(btnModifier);

// il faudra vérifier si il y a un token et dans ce cas afficher le bandereau admin et les modals pour supprimer et ajouter ect
if (localStorage.getItem("token")) {
  token = localStorage.getItem("token");
  blackBar.style.display = "flex"; // Show the nav bar
  btnLogin.textContent = "logout";
  buttons.parentNode.removeChild(buttons);
  btnModifier.style.marginTop = "5em";
  btnModifier.style.marginBottom = "7em";
} else {
  blackBar.style.display = "none"; // Hide the nav bar
  btnModifier.style.display = "none";
}

//récupération des travaux
const fetchWorks = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => {
      works = data;
      displayWorks(works);
      // console.log(works);
    });
};

const displayWorks = (worksToDisplay) => {
  gallery.innerHTML = worksToDisplay
    .map(
      (worksToDisplay) =>
        `

<figure><img src= ${worksToDisplay.imageUrl} >
<figcaption>${worksToDisplay.title}</figcaption>
</figure>
     `
    )
    .join("");
};

//récupération des catégories
const fetchCategories = async () => {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();
  buttons.innerHTML =
    `<button class="btn" onclick="filterWork('all')">Tous</button>` +
    categories
      .map(
        (category) => `
      <button class="btn" onclick="filterWork('${category.name}')">${category.name}</button>
    `
      )
      .join("");
};

// ma fonction filterwork a un le nom de la category sur laquel on a cliqué en paramètre
const filterWork = (nameCategory) => {
  console.log(nameCategory);
  if (nameCategory === "all") {
    displayWorks(works);
  } else {
    // je stock mon tableau filté par le nom des category
    const worksFiltered = works.filter((work) => {
      if (work.category.name === nameCategory) {
        return work;
      }
    });

    console.log(worksFiltered);

    displayWorks(worksFiltered);
  }
};

fetchWorks();
fetchCategories();

//Modal
const openModalLink = document.querySelector(".modifier");
const modal = document.getElementById("modal");
const closeButton = document.querySelector(".close");

openModalLink.addEventListener("click", function (event) {
  event.preventDefault();
  modal.style.display = "inherit";
  displayWorks(works); // Display all works in the modal
});

closeButton.addEventListener("click", function () {
  modal.style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

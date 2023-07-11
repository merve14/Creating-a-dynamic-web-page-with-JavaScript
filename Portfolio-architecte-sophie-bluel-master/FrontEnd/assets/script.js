const gallery = document.querySelector(".gallery");
const buttons = document.querySelector(".buttons");
let works = [];
let token = null;
const blackBar = document.getElementById("blackBar");
const btnLogin = document.querySelector("li.login");
const btnModifier = document.querySelector("div.icon-et-modifier");

// il faudra vérifier si il y a un token et dans ce cas afficher le bandereau admin et les modals pour supprimer et ajouter ect
if (localStorage.getItem("token")) {
  token = localStorage.getItem("token");
  blackBar.style.display = "flex"; // Show the nav bar
  btnLogin.textContent = "logout";
  btnLogin.setAttribute("id", "logout");
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
  populateCategories(categories);
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
const openPhotoAdd = document.querySelector("#ajouter-photo-btn");
const modal = document.getElementById("modal");
const modal2 = document.getElementById("modal2");
const closeButton = document.querySelector(".close");
const closeButton2 = document.querySelector(".close2");
const arrowLeft = document.querySelector("i.fa-solid.fa-arrow-left");
const selectCategorie = document.getElementById("select-categorie");

openModalLink.addEventListener("click", function (event) {
  event.preventDefault();
  modal.style.display = "inherit";
  const displayWorksInModal = (worksToDisplay) => {
    const travauxContainer = document.querySelector(".travaux");
    travauxContainer.innerHTML = worksToDisplay
      .map(
        (workToDisplay) => `
        <figure class="figure-modal">
  <img class="modal-image" id="${workToDisplay.id}" src="${workToDisplay.imageUrl}" />
  <i class="fa-solid fa-trash-can fa-xs delete-icon" data-id="${workToDisplay.id}"></i>
  <figcaption class="modal-editer">éditer</figcaption>
</figure>
        `
      )
      .join("");
  };
  displayWorksInModal(works); // Display all works in the modal
  const btnDeleteIcons = document.querySelectorAll(".delete-icon");
  btnDeleteIcons.forEach((btnDeleteIcon) => {
    btnDeleteIcon.addEventListener("click", function (event) {
      const id = parseInt(event.target.getAttribute("data-id"));
      deleteWork(id);
    });
  });
  const deleteWork = async (id) => {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    if (response.status === 204) {
      works = works.filter((work) => work.id !== id);
      displayWorks(works);
      displayWorksInModal(works);
    }
    //fetchWorks();
  };
});

closeButton.addEventListener("click", function () {
  modal.style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
// Open modal ajouter une photo
openPhotoAdd.addEventListener("click", function (event) {
  event.preventDefault();
  modal2.style.display = "inherit";

  // Close modal ajouter une photo
  closeButton2.addEventListener("click", function () {
    modal2.style.display = "none"; // Sortir de la modal ajouter une photo
    modal.style.display = "none"; // Sortir de la modal avec les photos
  });
  // Come back to modal 1
  arrowLeft.addEventListener("click", function () {
    modal2.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal2) {
      modal2.style.display = "none";
      modal.style.display = "none";
    }
  });
});

// Adding the categories with fetch for the form
const populateCategories = (categories) => {
  selectCategorie.innerHTML =
    `<option value=""></option>` + // To display an empty option by default
    categories
      .map(
        (category) => `<option value="${category.id}">${category.name}</option>`
      )
      .join("");
};

// Preview the downloaded image
const formInputImage = document.getElementById("form-input-image");
const placeAjoutPhotoDiv = document.querySelector(".place-ajout-photo");
const formInputTitle = document.getElementById("form-input-title");
const validerButton = document.querySelector("button.valider");

formInputImage.addEventListener("change", function (event) {
  const file = event.target.files[0]; // Get the selected file

  // Remove all child elements from the place-ajout-photo div (otherwise it adds up)
  while (placeAjoutPhotoDiv.firstChild) {
    placeAjoutPhotoDiv.removeChild(placeAjoutPhotoDiv.firstChild);
  }

  // Create an <img> element for the preview image
  const previewImage = document.createElement("img");

  // Set the source of the preview image
  previewImage.src = URL.createObjectURL(file);

  // Apply CSS styles to the preview image
  previewImage.style.maxWidth = "100%"; // Adjust the max width as needed
  previewImage.style.maxHeight = "100%"; // Adjust the max height as needed

  // Append the preview image to the place-ajout-photo div
  placeAjoutPhotoDiv.appendChild(previewImage);
});

// Function to check the form completion status and turn the valider button green
function checkFormCompletion() {
  const isPhotoSelected = formInputImage.files.length > 0;
  const isTitleEntered = formInputTitle.value.trim() !== "";
  const isCategorySelected = selectCategorie.value !== "";

  if (isPhotoSelected && isTitleEntered && isCategorySelected) {
    validerButton.style.background = "#1D6154";
    validerButton.style.cursor = "pointer";
    formInputImage.style.border = "none";
    formInputTitle.style.border = "none";
    selectCategorie.style.border = "none";
    placeAjoutPhotoDiv.style.border = "none";
  } else {
    formInputImage.style.border = "1px solid red";
    formInputTitle.style.border = "1px solid red";
    selectCategorie.style.border = "1px solid red";
    placeAjoutPhotoDiv.style.border = "1px solid red";
  }
}

// Event listeners for form elements
formInputImage.addEventListener("change", checkFormCompletion);
formInputTitle.addEventListener("input", checkFormCompletion);
selectCategorie.addEventListener("change", checkFormCompletion);

// Logout session when clicked on logout button
const btnLogout = document.querySelector("li#logout");

function logout() {
  // Clear the token from the local storage
  localStorage.removeItem("token");
  window.reload();
}

btnLogout.addEventListener("click", logout());
console.log(btnLogout);

function login() {
  window.location.href = "./login/login.html";
}
btnLogin.addEventListener("click", login);

// add a new work
const form = document.querySelector(".form-ajout-photo");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Create a FormData object
  const formData = new FormData();

  // Add the form data to the FormData object
  formData.append("image", formInputImage.files[0]);
  formData.append("title", formInputTitle.value);
  formData.append("category", selectCategorie.value);

  // console.log(formData.get("title"));
  console.log(formData.get("category"));
  console.log(formData.get("image"));
  // Send the form data to the API
  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json();
  works.push(result);
  displayWorks(works);
});

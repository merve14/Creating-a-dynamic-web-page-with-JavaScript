// let admin = {
//   email: "sophie.bluel@test.tld",
//   password: "S0phie",
// };

const email = document.forms["form"]["email"];
const password = document.forms["form"]["password"];
const loginErrorMsg = document.getElementById("login-error-msg");
const form = document.getElementById("login");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log(email);
  console.log(password);
  const formData = new FormData(form);
  const dataLogin = Object.fromEntries(formData);

  // const response = await fetch("http://localhost:5678/api/users/login", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json;charsert=utf-8",
  //   },

  //   body: JSON.stringify(dataLogin),
  // });

  // const data = await response.json();
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charsert=utf-8",
    },

    body: JSON.stringify(dataLogin),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.error) {
        email.style.border = "1px solid red";
        password.style.border = "1px solid red";
        loginErrorMsg.style.display = "block";
      } else {
        localStorage.setItem("token", data.token);
        window.location.href = "../index.html";
      }
    });
});

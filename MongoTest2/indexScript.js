document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var username = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    console.log(email, password);

    var formData = {
      username: username,
      password: password,
    };

    fetch("https://localhost:7251/api/Users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          alert("Neispravni kredencijali ❌");
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data !== null) {
          localStorage.setItem("username", data.username);
          localStorage.setItem("id", data.id);
          localStorage.setItem("isProfessor", data.isProfessor);
          window.open(`pocetna.html`, "_self");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

import { Post } from "./Post.js";

var username = localStorage.getItem("username");
var id = localStorage.getItem("id");
var isProfessor = JSON.parse(localStorage.getItem("isProfessor"));
localStorage.setItem("currentPage", "neocenjeni");

var heroBottom = document.querySelector(".hero-bottom");

fetchUnratedPostsAndRender();

let dugmeOdjava = document.querySelector(".dugme-odjava");
dugmeOdjava.addEventListener("click", function () {
  window.open(`index.html`, "_self");
  localStorage.setItem("username", null);
  localStorage.setItem("id", null);
  localStorage.setItem("isProfessor", null);
});

async function fetchUnratedPostsAndRender() {
  try {
    const response = await fetch("https://localhost:7251/api/Posts/getUnrated");
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();

    data.forEach((postData) => {
      const post = new Post(postData);
      post.nacrtaj(heroBottom, isProfessor, id, username);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchRatedPostsAndRender() {
  try {
    const response = await fetch("https://localhost:7251/api/Posts/getRated");
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();

    data.forEach((postData) => {
      const post = new Post(postData);
      post.nacrtaj(heroBottom, isProfessor, id, username);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

document
  .getElementById("postForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var title = document.getElementById("title").value;
    var studentId = document.getElementById("studentId").value;
    var description = document.getElementById("description").value;
    var repoLink = document.getElementById("repoLink").value;
    var rating = 0;
    var professorsName = "";
    var authorId = id;

    var postData = {
      title: title,
      studentId: studentId,
      description: description,
      repoLink: repoLink,
      rating: rating,
      professorsName: professorsName,
      authorId: authorId,
    };

    fetch("https://localhost:7251/api/Posts/kreirajPost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Post uspesno kreiran:", data);
        alert("Uspesno ste kreirali post! 🎉");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

var btnForma = document.querySelector(".display-form");

btnForma.addEventListener("click", function () {
  var forma = document.querySelector("form");
  if (btnForma.innerText == "Dodaj projekat") {
    forma.classList.remove("sakrij");
    btnForma.innerText = "Sakrij";
  } else if (btnForma.innerText == "Sakrij") {
    forma.classList.add("sakrij");
    btnForma.innerText = "Dodaj projekat";
  }
});

var btnOcenjeni = document.querySelector(".ocenjeni-projekti-btn");

btnOcenjeni.addEventListener("click", function () {
  localStorage.setItem("currentPage", "ocenjeni");
  while (heroBottom.firstChild) {
    heroBottom.removeChild(heroBottom.firstChild);
  }
  fetchRatedPostsAndRender();
});

var btnNeocenjeni = document.querySelector(".neocenjeni-projekti-btn");

btnNeocenjeni.addEventListener("click", function () {
  localStorage.setItem("currentPage", "neocenjeni");
  while (heroBottom.firstChild) {
    heroBottom.removeChild(heroBottom.firstChild);
  }
  fetchUnratedPostsAndRender();
});

var btnIzmeniSifru = document.querySelector(".izmeni-sifru-btn");

btnIzmeniSifru.addEventListener("click", function () {
  localStorage.setItem("currentPage", "izmeni-sifru");

  while (heroBottom.firstChild) {
    heroBottom.removeChild(heroBottom.firstChild);
  }
  var divSifra = document.createElement("div");
  divSifra.classList.add("div-sifra");

  var label1 = document.createElement("label");
  label1.textContent = "Stara sifra";

  var input1 = document.createElement("input");
  input1.setAttribute("type", "text");

  var label2 = document.createElement("label");
  label2.textContent = "Nova sifra";

  var input2 = document.createElement("input");
  input2.setAttribute("type", "password");

  var divDugme = document.createElement("div");
  divDugme.classList.add("submit-div");

  var dugmeSifra = document.createElement("button");
  dugmeSifra.textContent = "Izmeni";
  divDugme.appendChild(dugmeSifra);

  divSifra.appendChild(label1);
  divSifra.appendChild(input1);
  divSifra.appendChild(label2);
  divSifra.appendChild(input2);
  divSifra.appendChild(divDugme);

  dugmeSifra.addEventListener("click", function () {
    var oldPassword = input1.value;
    var newPassword = input2.value;

    var requestData = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    var options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    };

    fetch(`https://localhost:7251/api/Users/changePassword/${id}`, options)
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error("Doslo je do greske");
        }
      })
      .then((responseText) => {
        alert(responseText);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Doslo je do greske prilikom promene lozinke.");
      });
  });

  heroBottom.appendChild(divSifra);
});

if (!isProfessor) {
  const btnAdmin = document.querySelector(".admin-btn");
  btnAdmin.classList.add("sakrij");
}

if (isProfessor) {
  const btnAdmin = document.querySelector(".admin-btn");
  btnAdmin.addEventListener("click", function () {
    localStorage.setItem("currentPage", "admin");
    while (heroBottom.firstChild) {
      heroBottom.removeChild(heroBottom.firstChild);
    }

    var divKreirajKorisnike = document.createElement("div");
    divKreirajKorisnike.classList.add("div-sifra");

    var label1 = document.createElement("label");
    label1.textContent = "Pocetni broj indeksa";

    var input1 = document.createElement("input");
    input1.classList.add("pocetak-index");
    input1.setAttribute("type", "number");

    var label2 = document.createElement("label");
    label2.textContent = "Broj studenata";

    var input2 = document.createElement("input");
    input2.classList.add("broj-studenata");
    input2.setAttribute("type", "number");

    var divKreirajBtn = document.createElement("div");
    divKreirajBtn.classList.add("submit-div");

    var btnKreiraj = document.createElement("button");
    btnKreiraj.textContent = "Kreiraj";

    divKreirajKorisnike.appendChild(label1);
    divKreirajKorisnike.appendChild(input1);
    divKreirajKorisnike.appendChild(label2);
    divKreirajKorisnike.appendChild(input2);
    divKreirajBtn.appendChild(btnKreiraj);

    divKreirajKorisnike.appendChild(divKreirajBtn);

    heroBottom.appendChild(divKreirajKorisnike);

    btnKreiraj.addEventListener("click", function () {
      var pocetniIndex = Number(document.querySelector(".pocetak-index").value);
      var brojStudenata = Number(
        document.querySelector(".broj-studenata").value
      );

      fetch(
        `https://localhost:7251/api/Users/createMultipleUsers?startIndex=${pocetniIndex}&count=${brojStudenata}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text();
        })
        .then((data) => {
          alert("Uspesno ste kreirali korisnicke naloge 🥳");
          console.log("Response data:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });
}

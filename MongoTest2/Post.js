import { Comment } from "./Comment.js";

export class Post {
  constructor(postData) {
    this.id = postData.id;
    this.title = postData.title;
    this.studentId = postData.studentId;
    this.description = postData.description;
    this.repoLink = postData.repoLink;
    this.rating = postData.rating;
    this.professorsName = postData.professorsName;
    this.authorId = postData.authorId;
  }

  nacrtaj(divZaCrtanje, isProfessor, currentUserId, currentUserUsername) {
    const postDiv = document.createElement("div");
    var currentPage = localStorage.getItem("currentPage");

    postDiv.innerHTML = `
    ${
      currentPage != "pojedinacni"
        ? `<button class="btn-vise">Vise</button>`
        : ""
    }
    
    <div class="post-details-top">
        <h2>${this.title}</h2>
        <p>Broj indeksa: ${this.studentId}</p>
    </div>
    <div class="post-details-middle">
        <p> ${this.description}</p>
       
        <p><a href="${this.repoLink}" target="_blank">${this.repoLink}</a></p>
    </div>
    ${
      this.rating != 0
        ? `
    <div class="post-details-bottom">
        <p class="broj-poena">Broj poena: ${this.rating}</p>
        <p>Ocenio: ${this.professorsName}</p>
    </div>`
        : ""
    }
    ${
      isProfessor && currentPage != "pojedinacni"
        ? `
    <div class="post-details-buttons">
        <button class="oceni-btn" oceni-post-id="${this.id}">Oceni</button>
        <button class="komentarisi-btn" komentarisi-post-id="${this.id}">Komentarisi</button>
    </div>
    `
        : ""
    }
    ${
      this.authorId == currentUserId &&
      this.rating == 0 &&
      currentPage != "pojedinacni"
        ? `
      <div class="post-details-buttons">
          <button class="ukloni-btn" ukloni-post-id="${this.id}">Ukloni</button>
      </div>
      `
        : ""
    }`;

    postDiv.classList.add("post-div");

    divZaCrtanje.appendChild(postDiv);

    const ukloniBtn = postDiv.querySelector(".ukloni-btn");
    if (ukloniBtn) {
      ukloniBtn.addEventListener("click", () => {
        const postId = ukloniBtn.getAttribute("ukloni-post-id");

        const url = `https://localhost:7251/api/Posts?id=${postId}`;

        fetch(url, {
          method: "DELETE",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            alert("Post je uspesno obrisan. 🧹");
            divZaCrtanje.removeChild(ukloniBtn.parentNode.parentNode);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
    }

    const oceniBtn = postDiv.querySelector(".oceni-btn");
    if (oceniBtn) {
      oceniBtn.addEventListener("click", () => {
        const postId = oceniBtn.getAttribute("oceni-post-id");

        let userInput = prompt("Ocenite projekat: ");
        if (userInput === null) return null;
        let userInputInt = parseInt(userInput);
        if (userInputInt < 1 || userInputInt > 100) {
          alert("Ocena mora da bude u opsegu 1-100.");
          return;
        }

        const params = new URLSearchParams({
          id: this.id,
          rating: userInput,
          professorsName: currentUserUsername,
        });

        const url = `https://localhost:7251/api/Posts/azurirajPost?${params}`;

        const options = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        };

        fetch(url, options)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.text();
          })
          .then((data) => {
            alert(data);
            if (this.rating == 0)
              divZaCrtanje.removeChild(oceniBtn.parentNode.parentNode);
          })
          .catch((error) => {
            console.error("Error:", error);
          });

        if (currentPage === "ocenjeni") {
          var paragraf = document.querySelector(".broj-poena");
          paragraf.textContent = "Broj poena: " + userInput;
        }
      });
    }

    const komentarisiBtn = postDiv.querySelector(".komentarisi-btn");
    if (komentarisiBtn) {
      komentarisiBtn.addEventListener("click", () => {
        const postId = komentarisiBtn.getAttribute("komentarisi-post-id");
        var username = localStorage.getItem("username");
        var id = localStorage.getItem("id");
        var comment = prompt("Unesite komentar:");
        if (comment == null) return;

        var commentData = {
          text: comment,
          authorUsername: username,
          authorId: id,
          postId: postId,
        };

        var options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(commentData),
        };

        fetch("https://localhost:7251/api/Comments/dodajKomentar", options)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            console.log("Response data:", data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
    }

    const prikaziViseBtn = postDiv.querySelector(".btn-vise");
    if (prikaziViseBtn) {
      prikaziViseBtn.setAttribute("value", this.id);

      prikaziViseBtn.addEventListener("click", function (event) {
        localStorage.setItem("currentPage", "pojedinacni");
        var username = localStorage.getItem("username");
        var id = localStorage.getItem("id");
        var isProfessor = JSON.parse(localStorage.getItem("isProfessor"));
        var currentPostId = event.target.value;

        var heroBottom = document.querySelector(".hero-bottom");

        while (heroBottom.firstChild) {
          heroBottom.removeChild(heroBottom.firstChild);
        }

        fetch(`https://localhost:7251/api/Posts/getPostById/${currentPostId}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((postData) => {
            const post = new Post(postData);
            post.nacrtaj(heroBottom, isProfessor, id, username);
          })
          .catch((error) => {
            console.error("Error:", error);
          });

        fetch(
          `https://localhost:7251/api/Comments/vratiKomentare/${currentPostId}`
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok.");
            }
            return response.json();
          })
          .then((comments) => {
            comments.forEach((commentData) => {
              const comment = new Comment(commentData);
              comment.nacrtaj(heroBottom, isProfessor, id, username);
            });
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
    }
  }
}

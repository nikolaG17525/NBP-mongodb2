export class Comment {
  constructor(commentData) {
    this.id = commentData.id;
    this.text = commentData.text;
    this.authorUsername = commentData.authorUsername;
    this.authorId = commentData.authorId;
    this.postId = commentData.postId;
  }

  nacrtaj(divZaCrtanje, isProfessor, currentUserId, currentUserUsername) {
    const commentDiv = document.createElement("div");
    commentDiv.innerHTML = `
    <div class="comment-details">
    <p class="comment-author">@${this.authorUsername}</p>
    <p class="comment-text">${this.text}</p>
    </div>
    ${
      isProfessor && currentUserId === this.authorId
        ? `
        <div class="comment-buttons">
        <button class="izmeni-btn" post-id="${this.id}">Izmeni</button>
        <button class="obrisi-btn" post-id="${this.id}">Obriši</button>
        </div>
        `
        : ""
    }`;

    if (isProfessor && currentUserId === this.authorId) {
      const izmeniBtn = commentDiv.querySelector(".izmeni-btn");
      const obrisiBtn = commentDiv.querySelector(".obrisi-btn");

      izmeniBtn.addEventListener("click", () => {
        const commentId = izmeniBtn.getAttribute("post-id");
        const newText = prompt("Unesite novi tekst komentara:", `${this.text}`);
        if (newText === null) return;

        fetch(
          `https://localhost:7251/api/Comments/izmeniKomentar/${commentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newText),
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
        const tekstKomentara = commentDiv.querySelector(".comment-text");
        tekstKomentara.textContent = newText;
      });

      obrisiBtn.addEventListener("click", () => {
        var commentId = obrisiBtn.getAttribute("post-id");

        fetch(
          `https://localhost:7251/api/Comments/obrisiKomentar/${commentId}`,
          {
            method: "DELETE",
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            alert("Uspesno ste obrisali komentar 🍻");
          })
          .catch((error) => {
            console.error("Error:", error);
          });
        obrisiBtn.parentElement.parentElement.parentElement.removeChild(
          obrisiBtn.parentElement.parentElement
        );
      });
    }
    commentDiv.classList.add("comment-div");
    divZaCrtanje.appendChild(commentDiv);
  }
}

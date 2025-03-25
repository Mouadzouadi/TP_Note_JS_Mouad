import BasePage from '/app/js/views/BasePage.js';
import { generateCard, isFavorite, toggleFavorite } from "/app/js/services/CharactersUtils.js";
import CharactersProvider from "/app/js/services/CharactersProvider.js";

export default class Home extends BasePage {
  async render() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let allCharacters = await CharactersProvider.fetchCharacters();
    allCharacters = allCharacters.filter(character => favorites.includes(character.id));

    const headerHTML = /*html*/`
      <section class="py-5 text-center container">
        <div class="row py-lg-5">
          <div class="col-lg-6 col-md-8 mx-auto">
            <h1 class="fw-light">Personnages de jeux vidéo</h1>
            <p class="lead text-body-secondary">Découvrez vos personnages favoris des jeux vidéo.</p>
            <p>
              <a href="#/characters" class="btn btn-primary my-2">Voir tous les personnages</a>
            </p>
          </div>
        </div>
      </section>
    `;

    const contentHTML = allCharacters.length === 0 
      ? `<h2 class="text-center">Aucun personnage favori trouvé.</h2>`
      : /*html*/`
          <h2 class="text-center">Vos Personnages favoris</h2>
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            ${allCharacters.map(character => `
              <div class="col">
                ${generateCard(character, toggleFavorite, isFavorite(character.id))}
              </div>
            `).join('')}
          </div>
        `;

    return /*html*/`
      ${headerHTML}
      ${contentHTML}
    `;
  }

  async postRender() {
    (await CharactersProvider.fetchCharacters()).forEach(character => {
      const btn = document.querySelector(`#favoriteButton-${character.id}`);
      if (btn) {
        btn.addEventListener("click", () => {
          toggleFavorite(character.id);
          this.updateHeartIcon(character.id, isFavorite);
        });
      }
    });
  }
}

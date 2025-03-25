import BasePage from '/app/js/views/BasePage.js';
import Utils from '/app/js/services/Utils.js';
import { isFavorite, toggleFavorite, generateStars } from '/app/js/services/CharactersUtils.js';
import CharactersProvider from '/app/js/services/CharactersProvider.js';

export default class CharacterShow extends BasePage {
  async render() {
    const request = Utils.parseRequestURL();
    const character = await CharactersProvider.getCharacter(request.id);
    if (!character) {
      return `<h2>Personnage introuvable.</h2>`;
    }
    const isFav = isFavorite(character.id);
    const equipments = await CharactersProvider.getEquipmentsByCharacter(character.equipment_ids);
    const equipmentHTML = equipments.length > 0 
      ? equipments.map(equip => `<li>${equip.name} (${equip.type}) - Power: ${equip.power}</li>`).join("")
      : "<p>Aucun équipement disponible.</p>";
    const moyNotes = character.notes.length > 0 
      ? Math.round((character.notes.reduce((acc, note) => acc + note, 0) / character.notes.length) * 10) / 10 
      : 0;
    const stars = generateStars(moyNotes);

    return /*html*/`
      <section class="section">
        <h1>${character.name}${moyNotes > 0 ? ` (${moyNotes} ⭐)` : ''}</h1>
        ${character.image 
          ? `<img src="/data/images/${character.image}" alt="${character.name}" class="img-fluid" loading="lazy" style="max-width:300px; margin-bottom:1rem;">`
          : ''}
        <p><strong>Jeu d'origine :</strong> ${character.game}</p>
        <p><strong>Classe :</strong> ${character.class}</p>
        <p><strong>Niveau :</strong> ${character.level}</p>
        <p><strong>Expérience :</strong> ${character.experience}</p>
        <h3>Équipement :</h3>
        <ul>${equipmentHTML}</ul>
        <div id="rating" class="rating">
          ${stars}
        </div>
        <button id="submitRating" class="btn btn-primary" disabled>Soumettre la note</button>
        <!-- Utilisation de l'id formaté avec le character.id -->
        <button id="favoriteButton-${character.id}" class="btn btn-outline-danger favorite-btn" data-id="${character.id}">
          <span class="heart-icon">${isFav ? '❤️' : '🖤'}</span> Favoris
        </button>
      </section>
      <p><a href="/">Retour à l'accueil</a></p>
      <p><a href="#/characters">Retour à la liste des personnages</a></p>
    `;
  }

  async postRender() {
    const request = Utils.parseRequestURL();
    const characterId = request.id;
    document.querySelector(`#favoriteButton-${characterId}`)?.addEventListener("click", () => {
      toggleFavorite(characterId);
      this.updateHeartIcon(characterId, isFavorite);
    });

    let selectedRating = 0;
    document.querySelectorAll(".star").forEach((star, index) => {
      star.addEventListener("click", () => {
        selectedRating = index + 1;
        this.updateStarsDisplay(selectedRating);
        document.querySelector("#submitRating").disabled = false;
      });
    });

    document.querySelector("#submitRating")?.addEventListener("click", async () => {
      await CharactersProvider.addNote(characterId, selectedRating);
      document.querySelector("#submitRating").disabled = true;
      this.refreshCharacterData(characterId);
    });
  }

  updateStarsDisplay(rating) {
    document.querySelectorAll(".star").forEach(star => {
      if (parseInt(star.dataset.rating) <= rating) {
        star.classList.add('filled');
      } else {
        star.classList.remove('filled');
      }
    });
  }

  async refreshCharacterData(characterId) {
    const character = await CharactersProvider.getCharacter(characterId);
    const moyNotes = character.notes.length > 0 
      ? Math.round((character.notes.reduce((acc, note) => acc + note, 0) / character.notes.length) * 10) / 10 
      : 0;
    const stars = generateStars(moyNotes);
    document.querySelector("#rating").innerHTML = stars;
    const title = document.querySelector("h1");
    if (title) {
      title.innerHTML = `${character.name} ${moyNotes > 0 ? `(${moyNotes} ⭐)` : ''}`;
    }
  }
}

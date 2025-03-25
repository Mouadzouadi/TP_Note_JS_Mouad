import BasePage from '/app/js/views/BasePage.js';
import { generateCard, isFavorite, toggleFavorite } from "/app/js/services/CharactersUtils.js";
import { personnages, handleSelectionChange, updateCards, fight } from "/app/js/services/BagarreUtils.js";

export default class Bagarre extends BasePage {
  constructor() {
    super();
    this.characters = [];
    this.character1 = null;
    this.character2 = null;
  }

  async render() {
    const { characters, character1, character2 } = await personnages();
    this.characters = characters;
    this.character1 = character1;
    this.character2 = character2;

    return /*html*/`
      <section class="section" style="padding: 20px; text-align: center;">
        <h1>Bagarre</h1>
        <p>La bagarre est un jeu de combat entre des personnages de jeux vidéo.</p>
        
        <h2>Les règles</h2>
        <p>Les règles sont simples : choisissez 2 personnages et laissez-les se battre, la victoire sera déterminée par leurs niveau, expérience et équipements.</p>

        <h2>Les personnages</h2>
        <p>Vous pouvez consulter le détail des personnages <a href="#/characters">ici</a>.</p>

        <div class="bagarre" style="display: flex; justify-content: center; align-items: center; gap: 50px; padding: 20px;">
          <div class="row" style="text-align: center;">
            <p>Personnage 1</p>
            <select id="character1" style="margin-bottom:15px; padding:10px;">
              ${this.characters.map(character => `<option value="${character.id}">${character.name}</option>`).join("")}
            </select>
            <div id="card1" class="character-card" style="background: #f0f0f0; padding:10px; border-radius:10px;">
              ${generateCard(this.character1, toggleFavorite, isFavorite(this.character1.id))}
            </div>
          </div>

          <div style="font-size:24px; font-weight:bold;">VS</div>

          <div class="row" style="text-align: center;">
            <p>Personnage 2</p>
            <select id="character2" style="margin-bottom:15px; padding:10px;">
              ${this.characters.slice(1).map(character => `<option value="${character.id}">${character.name}</option>`).join("")}
              <option value="${this.characters[0].id}">${this.characters[0].name}</option>
            </select>
            <div id="card2" class="character-card" style="background: #f0f0f0; padding:10px; border-radius:10px;">
              ${generateCard(this.character2, toggleFavorite, isFavorite(this.character2.id))}
            </div>
          </div>
        </div>

        <button id="fight" class="btn btn-primary" style="margin-top:20px; padding:10px 20px; font-size:18px;">Fight</button>
      </section>
    `;
  }

  postRender() {
    handleSelectionChange(this.characters, (character1, character2) => {
      this.character1 = character1;
      this.character2 = character2;
      updateCards(this.character1, this.character2);
    });

    const fightButton = document.querySelector("#fight");
    if (fightButton) {
      fightButton.addEventListener("click", () => fight(this.character1, this.character2));
    }

    document.querySelectorAll('.favorite-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        const characterId = event.currentTarget.getAttribute('data-id');
        toggleFavorite(characterId);
        this.updateHeartIcon(characterId, isFavorite);
      });
    });
  }
}

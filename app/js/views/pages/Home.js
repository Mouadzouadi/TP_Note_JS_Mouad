import { generateCard, isFavorite, getFavorites, toggleFavorite, filterFavorites } from "/app/js/services/CharactersUtils.js";
import CharactersProvider from "/app/js/services/CharactersProvider.js";

export default class Home {
    async render() {
        const favorites = getFavorites();
        let allCharacters = await CharactersProvider.fetchCharacters();
        allCharacters = filterFavorites(allCharacters, favorites); 

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

        let contentHTML = '';
        if (allCharacters.length === 0) {
            contentHTML = `<h2 class="text-center">Aucun personnage favori trouvé.</h2>`;
        } else {
            contentHTML = /*html*/`
                <h2 class="text-center">Vos Personnages favoris</h2>
                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                    ${this.generateCharacterCards(allCharacters)}
                </div>
            `;
        }

        return /*html*/`
            ${headerHTML}
            ${contentHTML}
        `;
    }

    generateCharacterCards(characters) {
        return characters.map(character => `
            <div class="col">
                ${generateCard(character, isFavorite(character.id), toggleFavorite)}
            </div>
        `).join('');
    }

    async postRender() {
        const allCharacters = await CharactersProvider.fetchCharacters();
        allCharacters.forEach(character => {
            const btn = document.querySelector(`#favoriteButton-${character.id}`);
            if (btn) {
                btn.addEventListener("click", () => {
                    toggleFavorite(character.id);
                    this.updateHeartIcon(character.id);
                });
            }
        });
    }

    updateHeartIcon(characterId) {
        const isFav = isFavorite(characterId);
        const heartIcon = document.querySelector(`#favoriteButton-${characterId} .heart-icon`);
        if (heartIcon) {
            heartIcon.textContent = isFav ? '❤️' : '🖤';
        }
    }
}

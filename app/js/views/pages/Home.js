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
                    ${this.generateCharacterCards(allCharacters)}  <!-- Utilisation de la méthode existante -->
                </div>
            `;
        }

        return /*html*/`
            ${headerHTML}
            ${contentHTML}
        `;
    }

    generateCard(character) {
        return /*html*/`
        <div class="card shadow-sm">
            <div class="card-header text-center">
                <h5 class="card-title">${character.name}</h5>
                ${character.image ? 
                    `<img src="/data/images/${character.image}" class="img-fluid" alt="" style="width: 15rem; height: 15rem; object-fit: cover; margin-top: 1rem; border-radius: 2%;">`
                    : ''} <!-- Si image existe, on l'affiche, sinon on ne fait rien -->
            </div>
            <div class="card-body">
                <div class="card-text">
                    <p><strong>Jeu :</strong> ${character.game}</p>
                    <p><strong>Classe :</strong> ${character.class}</p>
                    <p><strong>Niveau :</strong> ${character.level}</p>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <a href="#/characters/${character.id}" class="btn btn-sm btn-outline-primary">
                        + Détail sur ${character.name}
                    </a>
                    ${this.generateFavoriteButton(character)}  <!-- Bouton de favori -->
                </div>
            </div>
        </div>



        `;
    }

    generateCharacterCard(character) {
        return /*html*/`
            <div class="col">
                ${this.generateCard(character)}
            </div>
        `;
    }

    generateFavoriteButton(character) {
        return /*html*/`
            <button id="favoriteButton-${character.id}" class="btn btn-outline-danger">
                <span class="heart-icon">${isFavorite(character.id) ? '❤️' : '🖤'}</span> Favoris
            </button>
        `;
    }

    generateCharacterCards(characters) {
        return characters.map(character => this.generateCharacterCard(character)).join('\n ');
    }

    async postRender() {
        const allCharacters = await CharactersProvider.fetchCharacters();
        allCharacters.forEach(character => {
            const btn = document.getElementById(`favoriteButton-${character.id}`);
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

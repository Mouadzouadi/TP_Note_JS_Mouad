import Utils from '/app/js/services/Utils.js';
import { isFavorite, toggleFavorite } from "/app/js/services/CharactersUtils.js";
import CharactersProvider from "/app/js/services/CharactersProvider.js";

export default class CharacterShow {
    async render() {
        let request = Utils.parseRequestURL();
        let post = await CharactersProvider.getCharacter(request.id);

        if (!post) {
            return `<h2>Personnage introuvable.</h2>`;
        }

        const isFav = isFavorite(post.id);

        let equipmentHTML = post.equipment.map(equip => `
            <li><strong>${equip.name}</strong> (${equip.type}) - Attaque: ${equip.attack}, Magie: ${equip.magic}</li>
        `).join('');

        return /*html*/`
            <section class="section">
                <h1>${post.name}</h1>
                <p><strong>Jeu d'origine :</strong> ${post.game}</p>
                <p><strong>Classe :</strong> ${post.class}</p>
                <p><strong>Niveau :</strong> ${post.level}</p>
                <p><strong>Expérience :</strong> ${post.experience}</p>

                <h3>Équipement :</h3>
                <ul>${equipmentHTML}</ul>

                <!-- Affichage du cœur favori -->
                <button id="favoriteButton" class="btn btn-outline-danger">
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

        document.getElementById("favoriteButton")?.addEventListener("click", () => {
            toggleFavorite(characterId);
            this.updateHeartIcon(characterId);
        });
    }

    updateHeartIcon(characterId) {
        const isFav = isFavorite(characterId);
        const heartIcon = document.querySelector('.heart-icon');
        if (heartIcon) {
            heartIcon.textContent = isFav ? '❤️' : '🖤';
        }
    }


}

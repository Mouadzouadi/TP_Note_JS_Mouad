import Utils from '/app/js/services/Utils.js';
import { isFavorite, toggleFavorite, generateStars } from "/app/js/services/CharactersUtils.js";
import CharactersProvider from "/app/js/services/CharactersProvider.js";

export default class CharacterShow {
    async render() {
        let request = Utils.parseRequestURL();
        let post = await CharactersProvider.getCharacter(request.id);

        if (!post) {
            return `<h2>Personnage introuvable.</h2>`;
        }

        const isFav = isFavorite(post.id);
        let equipments = await CharactersProvider.getEquipmentsByCharacter(post.equipment_ids);
        let equipmentHTML = equipments.length > 0 
            ? equipments.map(equip => `<li>${equip.name} (${equip.type}) - Power: ${equip.power}</li>`).join("")
            : "<p>Aucun équipement disponible.</p>";
        
        let moyNotes = post.notes.length > 0 
        ? Math.round((post.notes.reduce((acc, note) => acc + note, 0) / post.notes.length) * 10) / 10 
        : 0;

        const stars = generateStars(moyNotes);

        return /*html*/`
            <section class="section">
            <h1>${post.name}${moyNotes > 0 ? ` (${moyNotes} ⭐)` : ''}</h1>
            ${post.image ? 
                `<img src="/data/images/${post.image}" alt="${post.name}" class="img-fluid" style="max-width:300px; margin-bottom:1rem;">` 
                : ''}
            <p><strong>Jeu d'origine :</strong> ${post.game}</p>
            <p><strong>Classe :</strong> ${post.class}</p>
            <p><strong>Niveau :</strong> ${post.level}</p>
            <p><strong>Expérience :</strong> ${post.experience}</p>

            <h3>Équipement :</h3>
            <ul>${equipmentHTML}</ul>

            <!-- Affichage des étoiles -->
            <div id="rating" class="rating">
                ${stars}
            </div>

            <!-- Bouton pour soumettre la note -->
            <button id="submitRating" class="btn btn-primary" disabled>Soumettre la note</button>

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

        document.querySelector("#favoriteButton")?.addEventListener("click", () => {
            toggleFavorite(characterId);
            this.updateHeartIcon(characterId);
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
            await this.updateRating(characterId, selectedRating);
            this.refreshCharacterData(characterId);
        });
    }

    updateHeartIcon(characterId) {
        const isFav = isFavorite(characterId);
        const heartIcon = document.querySelector('.heart-icon');
        if (heartIcon) {
            heartIcon.textContent = isFav ? '❤️' : '🖤';
        }
    }

    updateStarsDisplay(rating) {
        const stars = document.querySelectorAll(".star");
        stars.forEach(star => {
            if (parseInt(star.dataset.rating) <= rating) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
            }
        });
    }

    async updateRating(characterId, rating) {
        await CharactersProvider.addNote(characterId, rating);
        document.querySelector("#submitRating").disabled = true;
        this.updateStarsDisplay(rating);
    }

    async refreshCharacterData(characterId) {
        const post = await CharactersProvider.getCharacter(characterId);
    
        let moyNotes = post.notes.length > 0 
            ? Math.round((post.notes.reduce((acc, note) => acc + note, 0) / post.notes.length) * 10) / 10 
            : 0;
    
        const stars = generateStars(moyNotes);
        
        document.querySelector("#rating").innerHTML = stars;
    
        const title = document.querySelector("h1");
        if (title) {
            title.innerHTML = `${post.name} ${moyNotes > 0 ? `(${moyNotes} ⭐)` : ''}`;
        }
    }
    
}

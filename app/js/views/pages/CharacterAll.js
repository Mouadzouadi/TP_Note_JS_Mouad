import { generateCard, isFavorite, getFavorites, toggleFavorite, filterFavorites } from "/app/js/services/CharactersUtils.js";
import CharactersProvider from "/app/js/services/CharactersProvider.js";

export default class CharacterAll {
    constructor() {
        const urlParams = new URLSearchParams(window.location.search);
        this.currentPage = 1;
        this.limit = 15;
        this.searchText = urlParams.get('search') || '';
        this.filterGame = urlParams.get('game') || '';
        this.filterClass = urlParams.get('class') || '';
        this.sortCriterion = urlParams.get('sort') || 'name';
        this.characters = [];
        this.showFavoritesOnly = false;
    }

    async render() {
        this.characters = await CharactersProvider.fetchCharacters();
        let filtered = this.characters;
        
        // Filtrage par favoris si demandé
        if (this.showFavoritesOnly) {
            const favorites = getFavorites();
            filtered = filtered.filter(character => favorites.includes(character.id));
        }

        // Recherche
        if (this.searchText) {
            filtered = filtered.filter(character =>
                character.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
                character.game.toLowerCase().includes(this.searchText.toLowerCase()) ||
                character.class.toLowerCase().includes(this.searchText.toLowerCase())
            );
        }

        // Dropdowns de filtrage
        const allGames = [...new Set(filtered.map(character => character.game))];
        const allClasses = [...new Set(filtered.map(character => character.class))];

        let filteredGames = allGames;
        let filteredClasses = allClasses;

        if (this.filterGame) {
            filtered = filtered.filter(character => character.game === this.filterGame);
            filteredClasses = [...new Set(this.characters
                .filter(character => character.game === this.filterGame)
                .map(character => character.class))];
        }

        if (this.filterClass) {
            filtered = filtered.filter(character => character.class === this.filterClass);
            filteredGames = [...new Set(this.characters
                .filter(character => character.class === this.filterClass)
                .map(character => character.game))];
        }

        // Tri
        filtered = this.sortCharacters(filtered);

        // Pagination
        const startIndex = (this.currentPage - 1) * this.limit;
        const endIndex = startIndex + this.limit;
        const paginatedCharacters = filtered.slice(startIndex, endIndex);

        let pagination = {
            prev: this.currentPage > 1,
            next: endIndex < filtered.length
        };

        let html = paginatedCharacters.map(character => generateCard(
            character,
            isFavorite(character.id),
            toggleFavorite
        )).join('');

        let paginationHtml = '';
        if (pagination.prev) {
            paginationHtml += `<button class="btn btn-primary" data-action="prevPage">Page Précédente</button>`;
        }
        if (pagination.next) {
            paginationHtml += `<button class="btn btn-primary" data-action="nextPage">Page Suivante</button>`;
        }

        const gameDropdownOptions = filteredGames.map(game =>
            `<option value="${game}" ${this.filterGame === game ? 'selected' : ''}>${game}</option>`
        ).join('');
        const classDropdownOptions = filteredClasses.map(classe =>
            `<option value="${classe}" ${this.filterClass === classe ? 'selected' : ''}>${classe}</option>`
        ).join('');

        return /*html*/`
            <div class="mb-3 text-end">
                <button class="btn btn-outline-warning" data-action="toggleFavorites">
                    ${this.showFavoritesOnly ? 'Voir tous les personnages' : 'Voir mes favoris'}
                </button>
            </div>
            <h2>Liste des personnages</h2>
            <div class="mb-3">
                <label for="searchInput" class="form-label">Recherche</label>
                <input type="text" id="searchInput" class="form-control" value="${this.searchText}" placeholder="Recherche...">
            </div>
            <div class="mb-3">
                <label for="filterGameDropdown" class="form-label">Filtrer par Jeu</label>
                <select id="filterGameDropdown" class="form-select">
                    <option value="">Tous les jeux</option>
                    ${gameDropdownOptions}
                </select>
            </div>
            <div class="mb-3">
                <label for="filterClassDropdown" class="form-label">Filtrer par Classe</label>
                <select id="filterClassDropdown" class="form-select">
                    <option value="">Toutes les classes</option>
                    ${classDropdownOptions}
                </select>
            </div>
            <div class="mb-3">
                <label for="sortSelect" class="form-label">Trier par :</label>
                <select id="sortSelect" class="form-select">
                    <option value="name" ${this.sortCriterion === 'name' ? 'selected' : ''}>Ordre alphabétique</option>
                    <option value="level" ${this.sortCriterion === 'level' ? 'selected' : ''}>Niveau</option>
                    <option value="experience" ${this.sortCriterion === 'experience' ? 'selected' : ''}>XP</option>
                </select>
                <button id="resetUrl" class="btn btn-primary">Réinitialiser</button>
            </div>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                ${html}
            </div>
            <div class="pagination">
                ${paginationHtml}
            </div>
        `;
    }

    sortCharacters(characters) {
        if (this.sortCriterion === 'name') {
            return characters.sort((a, b) => a.name.localeCompare(b.name));
        } else if (this.sortCriterion === 'level') {
            return characters.sort((a, b) => b.level - a.level);
        } else if (this.sortCriterion === 'experience') {
            return characters.sort((a, b) => b.experience - a.experience);
        }
        return characters;
    }

    async postRender() {
        // Pagination
        document.querySelector("[data-action='prevPage']")?.addEventListener("click", () => this.goToPage('prev'));
        document.querySelector("[data-action='nextPage']")?.addEventListener("click", () => this.goToPage('next'));
        // Tri et réinitialisation
        document.querySelector("#sortSelect")?.addEventListener("change", (event) => this.onSortChange(event));
        document.querySelector("#resetUrl")?.addEventListener("click", () => this.resetUrl());
        // Dropdowns
        document.querySelector("#filterGameDropdown")?.addEventListener("change", (event) => {
            this.filterGame = event.target.value;
            this.filterClass = "";
            this.updateURL();
        });
        document.querySelector("#filterClassDropdown")?.addEventListener("change", (event) => {
            this.filterClass = event.target.value;
            this.filterGame = "";
            this.updateURL();
        });
        // Recherche
        document.querySelector("#searchInput")?.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                this.searchText = event.target.value;
                this.updateURL();
            }
        });
        document.querySelectorAll('.favorite-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const characterId = event.currentTarget.getAttribute('data-id');
                toggleFavorite(characterId);
                this.updateContent();
            });
        });
        document.querySelector("[data-action='toggleFavorites']")?.addEventListener("click", () => {
            this.showFavoritesOnly = !this.showFavoritesOnly;
            this.updateContent();
        });
    }

    updateURL() {
        const url = new URL(window.location);
        if (this.searchText) {
            url.searchParams.set('search', this.searchText);
        } else {
            url.searchParams.delete('search');
        }
        if (this.filterGame) {
            url.searchParams.set('game', this.filterGame);
        } else {
            url.searchParams.delete('game');
        }
        if (this.filterClass) {
            url.searchParams.set('class', this.filterClass);
        } else {
            url.searchParams.delete('class');
        }
        url.searchParams.set('sort', this.sortCriterion);
        window.history.pushState({}, '', url);
        this.updateContent();
    }

    async updateContent() {
        const content = document.querySelector('#content');
        content.innerHTML = await this.render();
        await this.postRender();
    }

    async goToPage(direction) {
        if (direction === 'next') {
            this.currentPage++;
        } else if (direction === 'prev' && this.currentPage > 1) {
            this.currentPage--;
        }
        await this.updateContent();
    }

    async onSortChange(event) {
        this.sortCriterion = event.target.value;
        this.updateURL();
    }

    async resetUrl() {
        const url = new URL(window.location);
        url.searchParams.delete('search');
        url.searchParams.delete('game');
        url.searchParams.delete('class');
        url.searchParams.delete('sort');
        window.history.pushState({}, '', url);
        this.searchText = '';
        this.filterGame = '';
        this.filterClass = '';
        this.sortCriterion = 'name';
        this.currentPage = 1;
        await this.updateContent();
    }
}

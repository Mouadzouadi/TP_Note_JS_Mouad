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
        if (this.showFavoritesOnly) {
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            console.log(favorites);
            filtered = filtered.filter(character => favorites.includes(character.id));
            console.log(filtered);
        }

        if (this.searchText) {
            filtered = filtered.filter(character =>
                character.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
                character.game.toLowerCase().includes(this.searchText.toLowerCase()) ||
                character.class.toLowerCase().includes(this.searchText.toLowerCase())
            );
        }

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

        filtered = this.sortCharacters(filtered);

        const startIndex = (this.currentPage - 1) * this.limit;
        const endIndex = startIndex + this.limit;
        const paginatedCharacters = filtered.slice(startIndex, endIndex);

        let pagination = {
            prev: this.currentPage > 1,
            next: endIndex < filtered.length
        };

        let html = paginatedCharacters.map(character => /*html*/`
            <div class="col">
                <div class="card shadow-sm">
                    <div class="card-header text-center">
                        <h5 class="card-title">${character.name}</h5>
                    </div>
                    <div class="card-body">
                        <p><strong>Jeu :</strong> ${character.game}</p>
                        <p><strong>Classe :</strong> ${character.class}</p>
                        <p><strong>Niveau :</strong> ${character.level}</p>
                        <p><strong>Expérience :</strong> ${character.experience}</p>
                        <h6>Équipement principal :</h6>
                        <ul>
                            ${character.equipment.map(equip => /*html*/`
                                <li><strong>${equip.name}</strong> (${equip.type}) - Attaque: ${equip.attack}, Magie: ${equip.magic}</li>
                            `).join('')}
                        </ul>
                        <div class="d-flex justify-content-between align-items-center">
                            <a href="#/characters/${character.id}" class="btn btn-sm btn-outline-primary">
                                + Détail sur ${character.name}
                            </a>
                            <button class="btn btn-sm btn-outline-danger favorite-btn" data-id="${character.id}">
                                <span class="heart-icon">${this.isFavorite(character.id) ? '❤️' : '🖤'}</span> Favoris
                            </button>                        
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        let paginationHtml = '';
        if (pagination.prev) {
            paginationHtml += `<button id="prevPageBtn" class="btn btn-primary">Page Précédente</button>`;
        }
        if (pagination.next) {
            paginationHtml += `<button id="nextPageBtn" class="btn btn-primary">Page Suivante</button>`;
        }

        const gameDropdownOptions = filteredGames.map(game =>
            `<option value="${game}" ${this.filterGame === game ? 'selected' : ''}>${game}</option>`
        ).join('');
        const classDropdownOptions = filteredClasses.map(classe =>
            `<option value="${classe}" ${this.filterClass === classe ? 'selected' : ''}>${classe}</option>`
        ).join('');

        return /*html*/`
            <div class="mb-3 text-end">
                <button id="toggleFavorites" class="btn btn-outline-warning">
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
        document.getElementById("prevPageBtn")?.addEventListener("click", () => this.goToPage('prev'));
        document.getElementById("nextPageBtn")?.addEventListener("click", () => this.goToPage('next'));
        document.getElementById("sortSelect")?.addEventListener("change", (event) => this.onSortChange(event));
        document.getElementById("resetUrl")?.addEventListener("click", () => this.resetUrl());
        document.getElementById("filterGameDropdown")?.addEventListener("change", (event) => {
            this.filterGame = event.target.value;
            this.filterClass = "";
            this.updateURL();
        });
        document.getElementById("filterClassDropdown")?.addEventListener("change", (event) => {
            this.filterClass = event.target.value;
            this.filterGame = "";
            this.updateURL();
        });
        document.getElementById("searchInput")?.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                this.searchText = event.target.value;
                this.updateURL();
            }
        });
        document.querySelectorAll('.favorite-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const characterId = event.currentTarget.getAttribute('data-id');
                this.toggleFavorite(characterId);
                this.updateContent()
            });
        });
        document.getElementById("toggleFavorites")?.addEventListener("click", () => {
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
    isFavorite(characterId) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        return favorites.includes(characterId);
    }
    
    toggleFavorite(characterId) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
        if (favorites.includes(characterId)) {
            favorites = favorites.filter(id => id !== characterId);
        } else {
            favorites.push(characterId);
        }
    
        localStorage.setItem('favorites', JSON.stringify(favorites));
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

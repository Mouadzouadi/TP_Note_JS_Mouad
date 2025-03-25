import BasePage from '/app/js/views/BasePage.js';
import { 
  generateCard, isFavorite, toggleFavorite, 
  filterCharacters, sortCharacters, generateDropdownOptions 
} from '/app/js/services/CharactersUtils.js';
import CharactersProvider from '/app/js/services/CharactersProvider.js';

export default class CharacterAll extends BasePage {
  constructor() {
    super();
    const urlParams = new URLSearchParams(window.location.search);
    this.currentPage = 1;
    this.limit = 15;
    this.searchText = urlParams.get('search') || '';
    this.filterGame = urlParams.get('game') || '';
    this.filterClass = urlParams.get('class') || '';
    this.sortCriterion = urlParams.get('sort') || 'name';
    this.showFavoritesOnly = false;
    this.characters = [];
  }

  async render() {
    this.characters = await CharactersProvider.fetchCharacters();
    // Filtrage
    let filtered = filterCharacters(
      this.characters, 
      this.searchText, 
      this.filterGame, 
      this.filterClass, 
      this.showFavoritesOnly
    );

    const allGames = [...new Set(this.characters.map(c => c.game))];
    const allClasses = [...new Set(this.characters.map(c => c.class))];

    // Tri
    filtered = sortCharacters(filtered, this.sortCriterion);

    // Pagination
    const startIndex = (this.currentPage - 1) * this.limit;
    const paginatedCharacters = filtered.slice(startIndex, startIndex + this.limit);
    const pagination = {
      prev: this.currentPage > 1,
      next: startIndex + this.limit < filtered.length
    };

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
          ${generateDropdownOptions(allGames, this.filterGame)}
        </select>
      </div>
      <div class="mb-3">
        <label for="filterClassDropdown" class="form-label">Filtrer par Classe</label>
        <select id="filterClassDropdown" class="form-select">
          <option value="">Toutes les classes</option>
          ${generateDropdownOptions(allClasses, this.filterClass)}
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
        ${paginatedCharacters.map(character => 
          generateCard(character, toggleFavorite, isFavorite(character.id))
        ).join('')}
      </div>
      <div class="pagination">
        ${pagination.prev ? `<button class="btn btn-primary" data-action="prevPage">Page Précédente</button>` : ''}
        ${pagination.next ? `<button class="btn btn-primary" data-action="nextPage">Page Suivante</button>` : ''}
      </div>
    `;
  }

  async postRender() {
    // Pagination
    document.querySelector("[data-action='prevPage']")?.addEventListener("click", () => this.goToPage('prev'));
    document.querySelector("[data-action='nextPage']")?.addEventListener("click", () => this.goToPage('next'));

    // Tri et réinitialisation
    document.querySelector("#sortSelect")?.addEventListener("change", (event) => this.onSortChange(event));
    document.querySelector("#resetUrl")?.addEventListener("click", () => this.resetUrl());

    // Dropdowns de filtrage
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

    // Boutons favoris
    document.querySelectorAll('.favorite-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        const characterId = event.currentTarget.getAttribute('data-id');
        toggleFavorite(characterId);
        this.updateHeartIcon(characterId, isFavorite);
      });
    });

    // Toggle favoris
    document.querySelector("[data-action='toggleFavorites']")?.addEventListener("click", () => {
      this.showFavoritesOnly = !this.showFavoritesOnly;
      this.updateContent();
    });
  }

  updateURL() {
    const url = new URL(window.location);
    if (this.searchText) url.searchParams.set('search', this.searchText);
    else url.searchParams.delete('search');
    if (this.filterGame) url.searchParams.set('game', this.filterGame);
    else url.searchParams.delete('game');
    if (this.filterClass) url.searchParams.set('class', this.filterClass);
    else url.searchParams.delete('class');
    url.searchParams.set('sort', this.sortCriterion);
    window.history.pushState({}, '', url);
    this.updateContent();
  }

  async goToPage(direction) {
    if (direction === 'next') this.currentPage++;
    else if (direction === 'prev' && this.currentPage > 1) this.currentPage--;
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

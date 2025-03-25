
// Génère une carte de présentation pour un personnage
export function generateCard(character, toggleFavorite, isFav) {
    const moyNotes = character.notes.length > 0
      ? Math.round((character.notes.reduce((acc, note) => acc + note, 0) / character.notes.length) * 10) / 10
      : 0;
    const stars = generateStars(moyNotes);
    return /*html*/`
      <div class="card shadow-sm">
        <div class="card-header text-center">
          <h5 class="card-title">${character.name}</h5>
          ${character.image ? 
            `<img src="/data/images/${character.image}" class="img-fluid" alt="" loading="lazy"
            style="width: 15rem; height: 15rem; object-fit: cover; margin-top: 1rem; border-radius: 2%;">` 
            : ''}
        </div>
        <div class="card-body">
          <div class="card-text">
            <p><strong>Jeu :</strong> ${character.game}</p>
            <p><strong>Classe :</strong> ${character.class}</p>
            <p><strong>Niveau :</strong> ${character.level}</p>
            <div class="rating">
              ${moyNotes > 0 ? stars : '<br style="line-height: 2.3rem;">'}
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-3">
            <a href="#/characters/${character.id}" class="btn btn-sm btn-outline-primary">
              + Détail sur ${character.name}
            </a>
            <button id="favoriteButton-${character.id}" class="btn btn-outline-danger favorite-btn" data-id="${character.id}">
              <span class="heart-icon">${isFav ? '❤️' : '🖤'}</span> Favoris
            </button>
          </div>
        </div>
      </div>
    `;
  }
  
  // Retourne le tableau des identifiants favoris depuis le localStorage
  export function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  }
  
  // Vérifie si un personnage est dans les favoris
  export function isFavorite(characterId) {
    return getFavorites().includes(characterId);
  }
  
  // Ajoute ou retire un personnage des favoris
  export function toggleFavorite(characterId) {
    let favorites = getFavorites();
    if (favorites.includes(characterId)) {
      favorites = favorites.filter(id => id !== characterId);
    } else {
      favorites.push(characterId);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
  
  // Génère l'affichage des étoiles selon la note
  export function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += `<span class="star ${i <= rating ? 'filled' : ''}" data-rating="${i}">☆</span>`;
    }
    return stars;
  }
  
  // Filtre les personnages selon la recherche, le jeu, la classe et le mode favoris
  export function filterCharacters(characters, searchText, filterGame, filterClass, showFavoritesOnly) {
    let filtered = [...characters];
    if (showFavoritesOnly) {
      const favorites = getFavorites();
      filtered = filtered.filter(character => favorites.includes(character.id));
    }
    if (searchText) {
      filtered = filtered.filter(character =>
        character.name.toLowerCase().includes(searchText.toLowerCase()) ||
        character.game.toLowerCase().includes(searchText.toLowerCase()) ||
        character.class.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (filterGame) {
      filtered = filtered.filter(character => character.game === filterGame);
    }
    if (filterClass) {
      filtered = filtered.filter(character => character.class === filterClass);
    }
    return filtered;
  }
  
  // Trie les personnages selon le critère choisi
  export function sortCharacters(characters, sortCriterion) {
    return characters.sort((a, b) => {
      if (sortCriterion === 'name') return a.name.localeCompare(b.name);
      if (sortCriterion === 'level') return b.level - a.level;
      if (sortCriterion === 'experience') return b.experience - a.experience;
      return 0;
    });
  }
  
  // Génère les options pour un dropdown à partir d'un tableau d'items uniques
  export function generateDropdownOptions(items, selectedValue) {
    return items.map(item => 
      `<option value="${item}" ${selectedValue === item ? 'selected' : ''}>${item}</option>`
    ).join('');
  }
  
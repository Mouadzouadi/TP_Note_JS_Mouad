export function generateCard(character, isFavorite, toggleFavorite) {
    return /*html*/`
        <div class="card shadow-sm">
            <div class="card-header text-center">
                <h5 class="card-title">${character.name}</h5>
                ${character.image ? 
                    `<img src="/data/images/${character.image}" class="img-fluid" alt="" 
                    style="width: 15rem; height: 15rem; object-fit: cover; margin-top: 1rem; border-radius: 2%;">`
                    : ''} 
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
                    <button id="favoriteButton-${character.id}" class="btn btn-outline-danger favorite-btn" data-id="${character.id}">
                        <span class="heart-icon">${isFavorite ? '❤️' : '🖤'}</span> Favoris
                    </button>
                </div>
            </div>
        </div>
    `;
}

export function generateFavoriteButton(character, isFavorite) {
    return /*html*/`
        <button id="favoriteButton-${character.id}" class="btn btn-outline-danger favorite-btn" data-id="${character.id}">
            <span class="heart-icon">${isFavorite ? '❤️' : '🖤'}</span> Favoris
        </button>
    `;
}

export function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}

export function isFavorite(characterId) {
    const favorites = getFavorites();
    return favorites.includes(characterId);
}

export function toggleFavorite(characterId) {
    let favorites = getFavorites();
    if (favorites.includes(characterId)) {
        favorites = favorites.filter(id => id !== characterId);
    } else {
        favorites.push(characterId);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

export function filterFavorites(characters, favorites) {
    return characters.filter(character => favorites.includes(character.id));
}

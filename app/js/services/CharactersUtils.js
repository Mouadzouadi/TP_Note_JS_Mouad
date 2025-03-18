export function generateCard(character, isFavorite, toggleFavorite) {
    return /*html*/`
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

                    <div class="d-flex justify-content-between align-items-center">
                        <a href="#/characters/${character.id}" class="btn btn-sm btn-outline-primary">
                            + Détail sur ${character.name}
                        </a>
                        <button class="btn btn-sm btn-outline-danger favorite-btn" data-id="${character.id}">
                            <span class="heart-icon">${isFavorite ? '❤️' : '🖤'}</span> Favoris
                        </button>                        
                    </div>
                </div>
            </div>
        </div>
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

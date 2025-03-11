import CharactersProvider from "/app/js/services/CharactersProvider.js";

export default class CharacterAll {
    constructor() {
        this.currentPage = 1;
        this.limit = 15;
    }

    async render() {
        let characters = await CharactersProvider.fetchCharacters(this.currentPage, this.limit);

        if (!characters || characters.length === 0) {
            return `<h2>Aucun personnage trouvé.</h2>`;
        }

        let view = /*html*/`
            <h2>Tous les personnages</h2>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                ${characters.map(character => 
                    /*html*/`
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
                                    ${character.equipment.map(equip => `
                                        <li><strong>${equip.name}</strong> (${equip.type}) - Attaque: ${equip.attack}, Magie: ${equip.magic}</li>
                                    `).join('')}
                                </ul>

                                <div class="d-flex justify-content-between align-items-center">
                                    <a href="#/characters/${character.id}" class="btn btn-sm btn-outline-primary">
                                        Voir ${character.name}
                                    </a>
                                    <small class="text-body-secondary">ID: ${character.id}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
                ).join('\n')}
            </div>

            <!-- Pagination -->
            <div class="d-flex justify-content-between mt-4">
                <button class="btn btn-primary" ${this.currentPage === 1 ? 'disabled' : ''} onclick="this.goToPage('prev')">Précédent</button>
                <button class="btn btn-primary" onclick="this.goToPage('next')">Suivant</button>
            </div>
        `;
        return view;
    }

    goToPage(direction) {
        if (direction === 'next') {
            this.currentPage++;
        } else if (direction === 'prev' && this.currentPage > 1) {
            this.currentPage--;
        }

        this.render();
    }
}

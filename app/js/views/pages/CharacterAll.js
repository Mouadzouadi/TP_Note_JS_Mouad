import CharactersProvider from "/app/js/services/CharactersProvider.js";

export default class CharacterAll {
    constructor() {
        this.currentPage = 1;
        this.limit = 15;
        this.searchQuery = ''; 
    }

    async render() {
        const urlParams = new URLSearchParams(window.location.search);
        this.searchQuery = urlParams.get('search') || '';




        let characters;
        if (this.searchQuery) {
            characters = await CharactersProvider.fetchCharacters();
            characters = characters.filter(character => 
                character.name.toLowerCase().includes(this.searchQuery.toLowerCase()) // Filtrer selon le nom
                || character.game.toLowerCase().includes(this.searchQuery.toLowerCase()) // Filtrer selon le jeu
                || character.class.toLowerCase().includes(this.searchQuery.toLowerCase()) // Filtrer selon la classe
                || character.equipment.some(equip => equip.name.toLowerCase().includes(this.searchQuery.toLowerCase())) // Filtrer selon l'équipement
            );

            this.searchQuery = '';
            const url = new URL(window.location);
            url.searchParams.delete('search');
            window.history.pushState({}, '', url);

        } else {
            characters = await CharactersProvider.fetchCharactersByPage(this.currentPage, this.limit);
        }

        if (!characters || characters.length === 0) {
            return `<h2>Aucun personnage trouvé.</h2>`;
        }

        let html = characters.map(character =>
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

                        <h6>Équipement principal :</h6>
                        <ul>
                            ${character.equipment.map(equip => `
                                <li><strong>${equip.name}</strong> (${equip.type}) - Attaque: ${equip.attack}, Magie: ${equip.magic}</li>
                            `).join('')}
                        </ul>

                        <div class="d-flex justify-content-between align-items-center">
                            <a href="#/characters/${character.id}" class="btn btn-sm btn-outline-primary">
                                + Détail sur ${character.name}
                            </a>
                            <small class="text-body-secondary">ID: ${character.id}</small>
                        </div>
                    </div>
                </div>
            </div>
            `
        ).join('\n ');

        return /*html*/`
            <h2>Liste des personnages</h2>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                ${html}
            </div>
        `;
    }


    async postRender() {
        document.getElementById("prevPageBtn")?.addEventListener("click", () => this.goToPage('prev'));
        document.getElementById("nextPageBtn")?.addEventListener("click", () => this.goToPage('next'));
    }

    async goToPage(direction) {
        if (direction === 'next') {
            this.currentPage++;
        } else if (direction === 'prev' && this.currentPage > 1) {
            this.currentPage--;
        }

        console.log('Go to page', this.currentPage);

        let content = document.querySelector('#content');
        content.innerHTML = await this.render();
        await this.postRender();
    }
}

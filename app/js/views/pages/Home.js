import CharactersProvider from "/app/js/services/CharactersProvider.js";

export default class Home {
    async render() {
        let characters = await CharactersProvider.fetchCharacters(1, 3);

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
            <section class="py-5 text-center container">
                <div class="row py-lg-5">
                    <div class="col-lg-6 col-md-8 mx-auto">
                        <h1 class="fw-light">Personnages populaires</h1>
                        <p class="lead text-body-secondary">Découvrez les personnages emblématiques des jeux vidéo.</p>
                        <p>
                            <a href="#/characters" class="btn btn-primary my-2">Voir tous les personnages</a>
                        </p>
                    </div>
                </div>
            </section>
            <h2>Les 3 premiers personnages</h2>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                ${html}
            </div>
        `;
    }
}

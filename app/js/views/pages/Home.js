// Instantiate API
import CharactersProvider from "/app/js/services/CharactersProvider.js";

export default class Home {

    async render() {
        let characters = await CharactersProvider.fetchCharacters(3)
        let html = characters.map(character =>
            /*html*/`
            <div class="col">
            <div class="card shadow-sm">
                <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em">${character.title}</text></svg>
                <div class="card-body">
                    <p class="card-text">${character.text ? character.text.slice(0, 100) : ''}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="btn-group">
                        <a href="#/characters/${character.id}" class="btn btn-sm btn-outline-secondary">+ détail sur ${character.title}</a>
                        </div>
                        <small class="text-body-secondary">${character.id}</small>
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
                        <h1 class="fw-light">characters example</h1>
                        <p class="lead text-body-secondary">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem, aliquid voluptas sit aperiam quis architecto quaerat vel ratione placeat delectus repellendus cum animi sequi amet corporis minima ab, nisi at!</p>
                        <p>
                            <a href="" class="btn btn-primary my-2">Main call to action</a>
                            <a href="" class="btn btn-secondary my-2">Secondary action</a>
                        </p>
                    </div>
                </div>
            </section>
            <h2>Les 3 premiers characters</h2>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                ${html}
            </div>
        `;
    }
}
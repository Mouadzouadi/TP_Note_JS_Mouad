import Utils        from '/app/js/services/Utils.js';
import CharactersProvider from '/app/js/services/CharactersProvider.js';

export default class CharactersShow {
    async render () {
        let request = Utils.parseRequestURL()
        let post = await CharactersProvider.getcharacter(request.id)
        
        return /*html*/`
            <section class="section">
                <h1> character index : ${post.index}</h1>
                <p> Post Title : ${post.title} </p>
                <p> Post Content : ${post.text} </p>
            </section>
            <p><a href="/">back to home</a></p>
            <p><a href="#/characters">back to all characters</a></p>
        `
    }
}


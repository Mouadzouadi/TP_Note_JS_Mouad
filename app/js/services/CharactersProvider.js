import { ENDPOINT } from '/app/js/config.js';

export default class CharactersProvider {

    static fetchCharacters = async (page = 1, limit = 10) => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            const response = await fetch(`${ENDPOINT}?_page=${page}&_limit=${limit}`, options);
            const json = await response.json();
            return json;
        } catch (err) {
            console.log('Error getting documents', err);
        }
    }

    static getCharacter = async (id) => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            const response = await fetch(`${ENDPOINT}/` + id, options);
            const json = await response.json();
            return json;
        } catch (err) {
            console.log('Error getting documents', err);
        }
    }
}

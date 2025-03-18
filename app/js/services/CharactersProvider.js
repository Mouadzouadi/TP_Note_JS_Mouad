import { ENDPOINT } from '/app/js/config.js';

export default class CharactersProvider {

    static fetchCharacters = async () => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            const response = await fetch(`${ENDPOINT}/characters`, options);
            const json = await response.json();
            return json;
        } catch (err) {
            console.log('Error getting documents', err);
        }
    }

    static fetchCharactersByPage = async (page = 1, limit = 10) => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
            try {
                const response = await fetch(`${ENDPOINT}/characters?_page=${page}&_per_page=${limit}`, options);
                const json = await response.json();
                
                const characters = json.data;
                
                const pagination = {
                    first: json.first,
                    prev: json.prev,
                    next: json.next,
                    last: json.last,
                    pages: json.pages,
                    items: json.items
                };
    
            return { characters, pagination };
        } catch (err) {
            console.log('Error getting documents', err);
        }}
    static getCharacter = async (id) => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            const response = await fetch(`${ENDPOINT}/characters/` + id, options);
            const json = await response.json();
            return json;
        } catch (err) {
            console.log('Error getting documents', err);
        }
    }
    static getEquipmentsByCharacter = async (ids) => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
    
        try {
            const responses = await Promise.all(ids.map(id =>
                fetch(`${ENDPOINT}/equipments/` + id, options)
                    .then(response => response.json())
            ));
    
            const equipments = responses.flat();
    
            return equipments.length > 0 ? equipments : [];
        } catch (err) {
            console.log('Error getting documents', err);
            return [];
        }
    }
    
    
}

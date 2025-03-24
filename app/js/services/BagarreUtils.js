import { generateCard } from "/app/js/services/CharactersUtils.js";
import CharactersProvider from "/app/js/services/CharactersProvider.js";

async function getEquipmentPowerFromEquipments(equipmentsList) {
    return equipmentsList.reduce((total, equipment) => total + (equipment?.power || 0), 0);
}

export async function compareCharacters(char1, char2) {
    const levelFactor = 2;

    const equipmentsForChar1 = await CharactersProvider.getEquipmentsByCharacter(char1.equipment_ids);
    const equipmentsForChar2 = await CharactersProvider.getEquipmentsByCharacter(char2.equipment_ids);


    const power1 = await getEquipmentPowerFromEquipments(equipmentsForChar1);
    const power2 = await getEquipmentPowerFromEquipments(equipmentsForChar2);

    const score1 = power1 * (char1.level * levelFactor) * char1.experience;
    const score2 = power2 * (char2.level * levelFactor) * char2.experience;
    if (score1 > score2) {
        return char1;
    } else if (score1 < score2) {
        return char2;
    } else {
        return null;
    }
}
export async function personnages() {
    const characters = await CharactersProvider.fetchCharacters();
    const character1 = characters[0];
    const character2 = characters[1] || characters[0];
    return { characters, character1, character2 };
}

// Fonction pour gérer le changement de sélection
export function handleSelectionChange(characters, updateCards) {
    const select1 = document.querySelector("#character1");
    const select2 = document.querySelector("#character2");

    if (select1 && select2) {
        select1.addEventListener("change", () => {
            const character1 = characters.find(c => c.id === select1.value);
            updateCards(character1);
            resetStyleCard();
        });

        select2.addEventListener("change", () => {
            const character2 = characters.find(c => c.id === select2.value);
            updateCards(character2);
            resetStyleCard();
        });
    }
}

// Fonction pour mettre à jour les cartes
export function updateCards(character1, character2) {
    document.querySelector("#card1").innerHTML = generateCard(character1);
    document.querySelector("#card2").innerHTML = generateCard(character2);
}

// Fonction pour gérer le combat
export async function fight(character1, character2) {
    const winner = await compareCharacters(character1, character2);

    const card1 = document.querySelector("#card1");
    const card2 = document.querySelector("#card2");

    if (!winner) {
        card1.style.backgroundColor = "lightgray";
        card2.style.backgroundColor = "lightgray";
        alert("Égalité !");
    } else if (winner.id === character1.id) {
        card1.style.backgroundColor = "lightgreen";
        card2.style.backgroundColor = "lightcoral";
        alert(`Le gagnant est : ${winner.name}`);
    } else {
        card1.style.backgroundColor = "lightcoral";
        card2.style.backgroundColor = "lightgreen";
        alert(`Le gagnant est : ${winner.name}`);
    }
}

export function resetStyleCard(){
    const card1 = document.querySelector("#card1");
    const card2 = document.querySelector("#card2");
    card1.style.backgroundColor = "white";
    card2.style.backgroundColor = "white";
}

export default class BasePage {
    // Rafraîchit le contenu de la page en appelant render() puis postRender() si défini
    async updateContent() {
      const content = document.querySelector('#content');
      content.innerHTML = await this.render();
      if (typeof this.postRender === 'function') {
        await this.postRender();
      }
    }
  
    // Met à jour l'icône du favori pour un personnage
    updateHeartIcon(characterId, isFavoriteFn) {
      const isFav = isFavoriteFn(characterId);
      const heartIcon = document.querySelector(`#favoriteButton-${characterId} .heart-icon`);
      if (heartIcon) {
        heartIcon.textContent = isFav ? '❤️' : '🖤';
      }
    }
  }
  
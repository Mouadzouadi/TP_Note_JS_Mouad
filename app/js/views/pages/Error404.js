import BasePage from '/app/js/views/BasePage.js';

export default class Error404 extends BasePage {
  async render() {
    return `<h2>Error 404 - Page non trouvée</h2>`;
  }
}

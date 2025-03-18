import Home from '/app/js/views/pages/Home.js';
import CharacterAll from '/app/js/views/pages/CharacterAll.js';
import CharacterShow from '/app/js/views/pages/CharacterShow.js';
import About from '/app/js/views/pages/About.js';
import Error404 from '/app/js/views/pages/Error404.js';

import Utils from '/app/js/services/Utils.js';

// List of supported routes. Any url other than these routes will throw a 404 error
const routes = {
    '/'                     : Home,
    '/about'                : About,
    '/characters'           : CharacterAll,
    '/characters/:id'       : CharacterShow
};


// The router code. Takes a URL, checks against the list of supported routes and then renders the corresponding content page.
const router = async () => {
    const content = document.querySelector('#content');
    

    let request = Utils.parseRequestURL();
    let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '');
    
    let page = routes[parsedURL] ? new routes[parsedURL]() : new Error404();

    content.innerHTML = await page.render();

    if (typeof page.postRender === "function") {
        await page.postRender();
    }
};


// Listen on hash change:
window.addEventListener('hashchange', router);
// Listen on page load:
window.addEventListener('load', router);
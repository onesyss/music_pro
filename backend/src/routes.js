const { Router } = require('express');

const MusicController = require('./controllers/MusicController');
const SearchController = require('./controllers/SearchController');

const routes = Router();

routes.get('/musics', MusicController.index);
routes.post('/musics', MusicController.store);

routes.get('/search', SearchController.index);

module.exports = routes;
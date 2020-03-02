const Music = require('../models/Music');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(request, response) {
        const { latitude, longitude, categoria } = request.query;

        const categoriaArray = parseStringAsArray(categoria);

        const musics = await Music.find({
          categoria: {
                $in: categoriaArray,
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000,
                },
            },
        });

        return response.json({ musics });
    }
}
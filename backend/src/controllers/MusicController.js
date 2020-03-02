const axios = require('axios');
const Music = require('../models/Music');
const parseStringAsArray = require ('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
    async index(request, response) {
        const musics = await Music.find();

        return response.json(musics);
    },


    async store(request, response) {
        try {

       
        const { linkedin_username, categoria, latitude, longitude } = request.body;
        console.log('console1');
        let music = await Music.findOne({ linkedin_username });
        console.log('console2');
        if (!music) {
            const apiResponse = await axios.get(`https://www.linkedin.com/in/${linkedin_username}`);

            console.log(apiResponse);
    
            const { name = login, avatar_url, bio } = apiResponse.data;
    
            const categoriaArray = parseStringAsArray(categoria);
    
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
    
            const music = await Music.create({
             linkedin_username,
             name,
             avatar_url,
             bio,
             categoria: categoriaArray,
             location,
            })


            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                categoriaArray,
            )
                sendMessage(sendSocketMessageTo, 'new-music', music);

         } 
    
        return response.json(music);
         } catch (apierror) {
             return response.json(apierror);
         }
      }
};
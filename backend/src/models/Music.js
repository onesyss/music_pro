const mongoose = require('mongoose');
const PointSchema = require('./utils/PointSchema');

const MusicSchema = new mongoose.Schema({
    name: String,
    linkedin_username: String,
    bio: String,
    avatar_url: String,
    categoria: [String],
    location: {
        type: PointSchema,  
        index: '2dsphere'
    }
});

module.exports = mongoose.model('Music', MusicSchema);
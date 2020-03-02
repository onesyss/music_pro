const socketio = require('socket.io');

const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

let io;
const connections = [];

exports.setupWebsocket = (server) => {
    const io = socketio(server);

    io.on('connection', socket => { 
       const { latitude, longitude, categoria } = (socket.handshake.query);

       connections.push({
           id: socket.id,
           coordinates: {
               latitude: Number(latitude),
               longitude: Number(longitude),
           },
           categoria: parseStringAsArray(categoria),
       });
    });
}; 

exports.findConnections = (coordinates, categoria) => {
    return connections.filter(connection => {
        return calculateDistance(coordinates, connection.coordinates) < 10
        && connection.categoria.some(item => categoria.includes(item))
    })
} 

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        io.to(connection.id).emit(message, data);
    })
}
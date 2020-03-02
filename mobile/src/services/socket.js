import socketio from 'socket.io-client';

const socket = socketio( 'http://192.168.0.103:3333', {
    autoConnect: false,
});

function subscribeToNewMusic(subcribeFunction) {
    socket.on('new-music', subcribeFunction);
}

function connect(latitude, longitude, categoria) {
    socket.io.opts.query = {
        latitude,
        longitude,
        categoria,
    };

    socket.connect();

}

function disconnect() {
    if (socket.connected) {
        socket.disconnect();
    }
}

export {
    connect,
    disconnect,
    subscribeToNewMusic,
};

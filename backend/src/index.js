const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const routes = require('./routes');
const { setupWebsocket } = require('./websocket')


const app = express();
const server = http.Server(app);

setupWebsocket(server);
 
mongoose.connect('mongodb+srv://onesyss:Marlon2690@cluster0-ixcwp.mongodb.net/musicfinder?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
 
})


app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);









//Metodos HTTP: GET, POST, PUT, DELETE

//Tipos de paramêtros: 

//Query params: request.query (Filtros, ordenação, paginação, ...)
//Route params: request.params (Identificar um recurso na alteração ou remoção)
//Body: request.body (São dados para criação ou alteração de um registro)

//MongoDb (Não-relacional)

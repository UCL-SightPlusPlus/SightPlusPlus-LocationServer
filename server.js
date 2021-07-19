require('dotenv').config(); // load env vars in global var process.env
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const Device = require('./api/models/deviceModel'); // created model loading here
const Record = require('./api/models/recordModel');

// start socket server
const socketServer = require('./socket/udpSocket');
socketServer();

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const recordRoutes = require('./api/routes/recordRoute'); // importing route
const deviceRoutes = require('./api/routes/deviceRoute');
deviceRoutes(app);
recordRoutes(app); // register the route

module.exports = function stop() {
  server.close();
};

module.exports = app.listen(port, () => {
  console.log('Sight++ RESTful API server started on: ' + port);
});

require('dotenv').config(); // load env vars in global var process.env
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
// created model loading here
const Device = require('./api/models/deviceModel');
const Record = require('./api/models/recordModel');

// Start the scheduler
const updater = require('./schedulers/deviceUpdater');

const qnaAdapter = require('./adapters/qnaMakerAdapter');
// start socket server
const socketServer = require('./socket/udpSocket');
socketServer();

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
if ( process.env.DATABASE_USER == "" || process.env.DATABASE_USER == undefined) {
  mongoose.connect(`mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`, {
    useNewUrlParser: true, useUnifiedTopology: true});
} else {
  mongoose.connect(`mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`, {
    auth: {
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    },
    ssl: (process.env.DATABASE_SSL === 'true'), retrywrites: false, maxIdleTimeMS: 120000, useNewUrlParser: true, useUnifiedTopology: true});
}

// Initialize scheduler
updater.run_scheduler(process.env.DEVICE_CRON);

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const recordRoutes = require('./api/routes/recordRoute'); // importing route
const deviceRoutes = require('./api/routes/deviceRoute');
const questionRoutes = require('./api/routes/questionRoute');
const notificationRoutes = require('./api/routes/notificationRoute');
deviceRoutes(app);
recordRoutes(app); // register the route
questionRoutes(app);
notificationRoutes(app);

qnaAdapter.run(process.env.DEVICE_CRON);

module.exports = app.listen(port, () => {
  console.log('Sight++ RESTful API server started on: ' + port);
});

require('dotenv').config(); // load env vars in global var process.env
const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
const port = process.env.REST_PORT || 3000;
const cronExpression = process.env.DEVICE_CRON || '0 * * * *';
const mongoose = require('mongoose');
// created model loading here
const Device = require('./api/models/deviceModel');
const Record = require('./api/models/recordModel');

// Start the scheduler
const updater = require('./schedulers/deviceUpdater');
const orgServerUpdater = require('./schedulers/organisationServerUpdater');

const qnaAdapter = require('./adapters/qnaMakerAdapter');
// start socket server
const socketServer = require('./socket/udpSocket');
socketServer();

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`, {
  useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 1000});

mongoose.connection.once('connected', function() {
  console.log('Successfully connected to MongoDB.');
}).on('error', function(err) {
  console.log({'MONGODB ERR': err});
});

// Initialize schedulers
updater.run_scheduler(cronExpression);
orgServerUpdater.run_scheduler(cronExpression);

// Run the Azure QnA Service
qnaAdapter.run();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.setMaxListeners(9);

const recordRoutes = require('./api/routes/recordRoute'); // importing route
const deviceRoutes = require('./api/routes/deviceRoute');
const questionRoutes = require('./api/routes/questionRoute');
const notificationRoutes = require('./api/routes/notificationRoute');
deviceRoutes(app);
recordRoutes(app); // register the route
questionRoutes(app);
notificationRoutes(app);

if (process.env.SSL == 'YES') {
  module.exports = https.createServer({
    key: fs.readFileSync('./certs/server.key'),
    cert: fs.readFileSync('./certs/server.cert'),
  }, app)
      .listen(port, () => {
        console.log('Sight++ RESTful API server started on: ' + port);
      });
} else {
  module.exports = app.listen(port, () => {
    console.log('Sight++ RESTful API server started on: ' + port);
  });
}

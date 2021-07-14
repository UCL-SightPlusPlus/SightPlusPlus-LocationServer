require('dotenv').config() //load env vars in global var process.env
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Device = require('./api/models/deviceModel'), //created model loading here
  Record = require('./api/models/recordModel');

var updater = require('./schedulers/deviceUpdater');

  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true});

//Initialize scheduler
updater.run_scheduler(process.env.DEVICE_CRON);

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

var recordRoutes = require('./api/routes/recordRoute'); //importing route
var deviceRoutes = require('./api/routes/deviceRoute');
deviceRoutes(app);
recordRoutes(app); //register the route

app.listen(port, () => {
    console.log('Sight++ RESTful API server started on: ' + port);
});
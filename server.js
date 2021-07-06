var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Device = require('./api/models/deviceModel'), //created model loading here
  Record = require('./api/models/recordModel');
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Tododb'); 

app.use(express.urlencoded());
app.use(express.json());

var recordRoutes = require('./api/routes/recordRoute'); //importing route
var deviceRoutes = require('./api/routes/deviceRoute');
deviceRoutes(app);
recordRoutes(app); //register the route



app.listen(port, () => {
    console.log('Sight++ RESTful API server started on: ' + port);
});
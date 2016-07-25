var express = require('express');
var bodyParser = require('body-parser');
var jsonld = require('jsonld');
var url = require('url');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

// create application/json parser
var jsonParser = bodyParser.json();

app.get('/parking', function (req, res) {
  var json = req.query.json;
  var parsedJson;
  var errors;
  var occupied;
  var total;
  var free;

  if (json != undefined) {
    parsedJson = JSON.parse(json);
    errors = validateJsonld(parsedJson);
    occupied = parsedJson['dtx:parkingSpaceOccupied'];
    total = parsedJson['dtx:totalCapacity'];
    free = total - occupied;
//    if (!parsedJson('@context')) {
//      res.render('empty', { title: 'Home', errors: errors});
//    }
    res.render('index',{ title : 'Home', data: parsedJson, freeSpace: free, errors : errors });
  } else {
    console.log("No json was found");
    res.render('empty', { title: 'Home'});
  }




  //res.send(json);

});

function validateJsonld(json) {
  var errors = {};
  if (json["@context"] == null) {
    errors.context = "No context was found";
  }
  if (json["@type"] == null) {
    errors.type = "No type was found";
  }
  if (json["dtx:parkingName"] == null) {
    errors.name = "The parkingName was not found";
  }
  if (json["dtx:parkingSiteAddress"] == null) {
    errors.address = "The parkingSiteAddress was not found";
  }
  if (json["dtx:parkingLocation"] == null) {
    errors.location = "The parkingLocation was not found";
  }
  if (json["dtx:contactDetailsTelephoneNumber"] == null) {
    errors.telephone = "The contactDetailsTelephoneNumber was not found";
  }
  if (json["dtx:parkingDescription"] == null) {
    errors.description = "The parkingDescription was not found";
  }
  if (json["dtx:parkingSpaceOccupied"] == null) {
    errors.spaceOccupied = "The parkingSpaceOccupied was not found";
  }
  if (json["dtx:totalCapacity"] == null) {
    errors.capacity = "The totalCapacity was not found";
  }
  if (json["dtx:latitude"] == null) {
    errors.latitude = "The latitude was not found";
  }
  if (json["dtx:longitude"] == null) {
    errors.longitude = "The longitude was not found";
  }

  return errors;
}

app.post('/json', jsonParser, function (req, res) {
  var json = req.body;
  var errors = validateJsonld(json);
  res.send(errors);


});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});

'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
let fs = require("fs");
const { uuid } = require('uuidv4');
const { checkForChanges } = require('../checkForChanges');
const router = express.Router();

router.get('/', (req, res) => {
  console.log("Server Function is running properly . . .");
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});

router.get('/ganeshpartheeban', (req, res) => {
  var rating = req.query.rating;
  res.writeHead(200, { 'Content-Type': 'text/html' });
  if(rating === 'happy'){
    res.write('<h1>Glad that you are happy with our service</h1> <h1>Thanks for rating Ganesh Partheeban</h1>');
  }
  if(rating === 'sad'){
    res.write('<h1>Sorry for providing a unsatisfactory service</h1> <h1>Thanks for rating Ganesh Partheeban</h1>');
  }
  if(rating === 'meh'){
    res.write('<h1>We are hoping to serve you better next time</h1> <h1>Thanks for rating Ganesh Partheeban</h1>');
  }
  res.end();
});


// router.get('/another', (req, res) => res.json({ route: req.originalUrl }));

// router.post('/', (req, res) => {
//   console.log(req);
//   console.log(res);
//   var fileName = uuid();
// fs.writeFile(fileName+".json", JSON.stringify(req), function(error) {
//     if (error) {
//         console.log("Error");
//     } else {
//         console.log("Success");
//     }
//   });
// });

router.post('/', async (req, res) => {
  console.log("Route : / : POST from Drive API")
  console.log(" /-------------- ----------------------  RESPONSE DATA  ------------------ --------------------------/");
  console.log(res.req.headers)
  console.log(" /-------------- ----------------------  RESPONSE DATA  ------------------ --------------------------/");
  const driveChanges = await checkForChanges();
  console.log('---------------------');
  console.log(driveChanges);
});

router.post('/.netlify/functions/server/', (req, res) => {
  console.log("Route : /.netlify/functions/server/ : POST from Drive API")
  console.log("POST from Drive API");
});

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);

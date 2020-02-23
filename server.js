var express = require('express');
var app = express();
var firebase = require('firebase/app');
var firebaseAuth = require('firebase/auth')
//var firebaseui = require('firebaseui');


/*
  Websites used to integrate firebase with node backend
  https://medium.com/@csgsajeewa/restful-web-service-with-node-js-google-app-engine-and-firebase-48910b0b16a7
  https://www.youtube.com/watch?v=iKlWaUszxB4
  https://firebase.google.com/docs/web/setup
*/

//Firebase authentication for developers
var admin = require('firebase-admin');
var serviceAccount = require("./serviceAccountKey.json")
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://booknet-2020.firebaseio.com"
})

//Firebase configuration to edit database from backend
// var firebaseConfig = {
//     apiKey: "AIzaSyAgcu40BB41MvVRFuj5yvw0nK8BNY5Gge4",
//     authDomain: "booknet-2020.firebaseapp.com",
//     databaseURL: "https://booknet-2020.firebaseio.com",
//     projectId: "booknet-2020",
//     storageBucket: "booknet-2020.appspot.com",
//     messagingSenderId: "1058293024199",
//     appId: "1:1058293024199:web:bb0abaf5502b0b34c6c5e2",
//     measurementId: "G-J9XB3LH5VF"
//   };
//   firebase.initializeApp(firebaseConfig)

  app.get('/api/users', (req, res) => {
    const users = [
      {id: 1, firstName: 'John', lastName: 'Doe'},
      {id: 2, firstName: 'Brad', lastName: 'Dough'},
      {id: 3, firstName: 'Mary', lastName: 'Swanson'},
    ];
  
    res.json(users);
  });
  
  app.put('/', function (req, res) {
    console.log("HTTP Put Request");
    res.send("HTTP PUT Request");
  });
  
  app.post('/', function (req, res) {
    console.log("HTTP POST Request");
    res.send("HTTP POST Request");  
  });
  
  app.delete('/', function (req, res) {
    console.log("HTTP DELETE Request");
    res.send("HTTP DELETE Request");
  });

  var server = app.listen(5000, function () {

    var host = server.address().address;
    var port = server.address().port;
  
    console.log("Example app listening at http://%s:%s", host, port);
  });

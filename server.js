var express = require('express');
var app = express();
var firebase = require('firebase/app');
var firebaseAuth = require('firebase/auth')
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     
  extended: true
}));
var jsonParser = bodyParser.json();
var urlParser = bodyParser.urlencoded();
app.use(express.json());
app.use(express.urlencoded());
const axios = require('axios')

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
var firebaseConfig = {
    apiKey: "AIzaSyAgcu40BB41MvVRFuj5yvw0nK8BNY5Gge4",
    authDomain: "booknet-2020.firebaseapp.com",
    databaseURL: "https://booknet-2020.firebaseio.com",
    projectId: "booknet-2020",
    storageBucket: "booknet-2020.appspot.com",
    messagingSenderId: "1058293024199",
    appId: "1:1058293024199:web:bb0abaf5502b0b34c6c5e2",
    measurementId: "G-J9XB3LH5VF"
  };
  firebase.initializeApp(firebaseConfig)


  //default hard-coded array of users to confirm back can send to front
  app.get('/api/users', (req, res) => {
    const users = [
      {id: 1, firstName: 'John', lastName: 'Doe'},
      {id: 2, firstName: 'John', lastName: 'Dough'},
      {id: 3, firstName: 'Jane', lastName: 'Doh'}
    ];
    res.json(users);
  });


  //get booksNeeded from database     
  function getBooks(userID, ISBN) {
    var booksNeededPath = admin.database().ref('users/' + userID + '/booksNeeded/' + ISBN);
    booksNeededPath.once('value')
      .then (function(snapshot) {
      var titles = new Array()

      var title = snapshot.child("title").val();
      titles.push(title);
      console.log(titles)
      return titles;
    });
  }

  //random function that returns a WORKING array 
  function BlockID() {
    var IDs = new Object();
        IDs['s'] = "Images/Block_01.png";
        IDs['g'] = "Images/Block_02.png";
        IDs['C'] = "Images/Block_03.png";
        IDs['d'] = "Images/Block_04.png";
    return IDs;
  }

  //get books needed from database and send to frontend
  app.get('/api/getBooksNeeded', (req, res) => {
    var books = getBooks('taJ6elpogCXeOSu9oStdJRpIZQS2', 100);
    console.log(books);
    var images = BlockID();
    //console.log(images);
    res.json(books);
  });


  //write booksNeeded to database
  function setBooksNeeded(userID, ISBN, title, author) {  
    admin.database().ref('users/' + userID + '/booksNeeded/' + ISBN).set({
      title: title,
      author: author
    });
  }

  // //add books needed to database
  // app.get('/api/setBooksNeeded', (req, res) => {
  //   addBooks('taJ6elpogCXeOSu9oStdJRpIZQS2', 100, 'Harry Potter', 'JK Rowling');
  // });

  app.post('/api/setBooksNeeded', urlParser, function (req, res) {
    var userid = req.body.userid;
    var ISBN = req.body.ISBN;
    var title = req.body.title;
    var author = req.body.author;
    setBooksNeeded(req.body.userid, req.body.ISBN, req.body.title, req.body.author);
  });





//USER FUNCTIONS START HERE



  //delete user data from database
  function deleteUserData(userID) {
    admin.database().ref('users/' + userID).remove();
  }


  //write data about user to database
  function writeUserData(firstName, lastName, userID) {

    //path for setting info is users/firstName+lastName directory

    admin.database().ref('users/' + userID).set({
      firstname: firstName,
      lastname: lastName
    });
  }

   //read data about user from database
   function getFirstName(userID) {
    
    //specify path to different fields in the users/ directory
    var firstNamePath = admin.database().ref('users/' + userID + '/firstname');
    var lastNamePath = admin.database().ref('users/' + userID + '/lastname');

    //use snapshot function on 'value' to get info

    firstNamePath.on('value', function(snapshot) {
      
      //call function here later... console.log just to print output for now

      console.log(snapshot.val());
      return snapshot.val();
    });
  }
    
  
  app.put('/', function (req, res) {
    console.log("HTTP Put Request");
    res.send("HTTP PUT Request");
  });

  //read from axios post in frontend, write name to firebase using users/userID path
  app.post('/api/name', urlParser, function (req, res) {
    var firstName = JSON.stringify(req.body.firstname);
    var lastName = JSON.stringify(req.body.lastname);
    var userid = req.body.userid;
    //console.log(req.body);
    writeUserData(req.body.firstname, req.body.lastname, req.body.userid)
  });

  //delete user from database with path users/userID
  app.post('/api/remove', urlParser, function (req, res) {
    var userid = req.body.userid;
    //console.log(req.body);
    deleteUserData(req.body.userid)
  });
  
  app.delete('/', function (req, res) {
    console.log("HTTP DELETE Request");
    res.send("HTTP DELETE Request");
  });



//SERVER ON PORT 5000

  var server = app.listen(5000, function () {

    var host = server.address().address;
    var port = server.address().port;
  
    console.log("Example app listening at http://%s:%s", host, port);
  });

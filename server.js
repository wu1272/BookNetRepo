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
    { id: 1, firstName: 'John', lastName: 'Doe' },
    { id: 2, firstName: 'John', lastName: 'Dough' },
    { id: 3, firstName: 'Jane', lastName: 'Doh' }
  ];
  res.json(users);
});



//GET BOOKSNEEDED
//get ALL booksNeeded from database     
function getBooksNeeded(authors, titles, userID, callback) {
  var booksNeededPath = admin.database().ref('users/' + userID + '/booksNeeded/');
  booksNeededPath.once('value')
    .then(function (snapshot) {
      snapshot.forEach(function (child) {
        var title = child.child("title").val();
        var author = child.child("author").child("0").val();
        titles.push(title);
        authors.push(author);
      });
      callback();
    });
}

//get books needed from database and send to frontend
app.get('/api/getBooksNeeded', (req, res) => {
  var titles = [];
  var authors = [];
  getBooksNeeded(authors, titles, 'taJ6elpogCXeOSu9oStdJRpIZQS2', function () {
    console.log(titles);
    res.json(titles);
    console.log(authors);
    res.json(authors);
  });
});




//SET BOOKSNEEDED
//write booksNeeded to database
function setBooksNeeded(userID, bookID, title, author) {
  admin.database().ref('users/' + userID + '/booksNeeded/' + bookID).set({
    title: title,
    author: author
  });
}

app.post('/api/setBooksNeeded', urlParser, function (req, res) {
  setBooksNeeded(req.body.userid, req.body.bookID, req.body.title, req.body.author);
});




//SET BOOKS AVAILABLE
function setBooksAvailable(userID, bookID, title, author, sale, donate, trade) {
  admin.database().ref('users/' + userID + '/booksAvailable/' + bookID).set({
    author: author,
    title: title,
    sale: sale,
    donate: donate,
    trade: trade,
  });
}

app.post('/api/setBooksAvailable', urlParser, function (req, res) {
  setBooksAvailable(req.body.userid, req.body.bookID, req.body.title, req.body.author, req.body.sale, req.body.donate, req.body.trade);
});





//SET BOOKS AS PENDING
function setPending(userNeededID, userAvailableID, bookNeededID, bookAvailableID) {
  admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID).update({"pending":"true"})
  admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID).update({"tradePartner":userAvailableID})
  admin.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID).update({"tradePartner":userNeededID})
  admin.database().ref('users/' + userNeededID + '/booksAvailable/' + bookAvailableID).update({"pending":"true"})
  admin.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID).update({"pending":"true"})
  admin.database().ref('users/' + userAvailableID + '/booksAvailable/' + bookNeededID).update({"pending":"true"})
}

app.post('/api/setPending', urlParser, function (req, res) {
  setPending(req.body.userNeededID, req.body.userAvailableID, req.body.bookNeededID, req.body.bookAvailableID)
});


//REMOVES PENDING STATUS
function removePending(userNeededID, userAvailableID, bookNeededID, bookAvailableID) {
  admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID + "/pending").remove();
  admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID + "/tradePartner").remove();
  admin.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID + "/tradePartner").remove();
  admin.database().ref('users/' + userNeededID + '/booksAvailable/' + bookAvailableID + "/pending").remove();
  admin.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID + "/pending").remove();
  admin.database().ref('users/' + userAvailableID + '/booksAvailable/' + bookNeededID + "/pending").remove();
}

app.post('/api/removePending', urlParser, function (req, res) {
  removePending(req.body.userNeededID, req.body.userAvailableID, req.body.bookNeededID, req.body.bookAvailableID)
});


//REMOVES ALL POTENTIAL TRADES
function removeTrade(userNeededID, userAvailableID, bookNeededID, bookAvailableID) {
  admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID).remove();
  admin.database().ref('users/' + userNeededID + '/booksAvailable/' + bookAvailableID).remove();
  admin.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID).remove();
  admin.database().ref('users/' + userAvailableID + '/booksAvailable/' + bookNeededID).remove();
}

app.post('/api/removeTrade', urlParser, function (req, res) {
  removeTrade(req.body.userNeededID, req.body.userAvailableID, req.body.bookNeededID, req.body.bookAvailableID)
});


//SETS CONFIRM STATE FOR TRADE
function confirmTrade(userNeededID, bookNeededID) {
  //console.log('users/' + userNeededID + '/booksNeeded/' + bookNeededID)
  admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID).update({"confirmed":"true"})
}

app.post('/api/confirmTrade', urlParser, function (req, res) {
  confirmTrade(req.body.userNeededID, req.body.bookNeededID)
});




//DELETE BOOKS
function deleteBooksAvailable(userID, bookID) {
  admin.database().ref('users/' + userID + '/booksAvailable/' + bookID).remove();
}

function deleteBooksNeeded(userID, bookID) {
  //console.log("HERE:" + bookID)
  admin.database().ref('users/' + userID + '/booksNeeded/' + bookID).remove();
}


//delete book from needBooks and availableBooks
//booksNeeded
app.post('/api/bookNeededRemove', urlParser, function (req, res) {
  deleteBooksNeeded(req.body.userid, req.body.bookID)
});
//booksAvailable
app.post('/api/bookAvailableRemove', urlParser, function (req, res) {
  deleteBooksAvailable(req.body.userid, req.body.bookID)
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

  firstNamePath.on('value', function (snapshot) {

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
  writeUserData(req.body.firstname, req.body.lastname, req.body.userid)
});

//delete user from database with path users/userID
app.post('/api/remove', urlParser, function (req, res) {
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
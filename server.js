"use strict";
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();
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


var user_needed_email;
var user_needed_name;
var user_available_email
var user_available_name;
var users = [];

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
function setBooksNeeded(userID, bookID, title, author, img) {
  admin.database().ref('users/' + userID + '/booksNeeded/' + bookID).set({
    title: title,
    author: author,
    bookImg: img,
    bookID: bookID 
  });
}

app.post('/api/setBooksNeeded', urlParser, function (req, res) {
  setBooksNeeded(req.body.userid, req.body.bookID, req.body.title, req.body.author, req.body.bookImg);
});




//SET BOOKS AVAILABLE
function setBooksAvailable(userID, bookID, title, author, sale, donate, trade, bookImg, condition) {
  admin.database().ref('users/' + userID + '/booksAvailable/' + bookID).set({
    author: author,
    title: title,
    sale: sale,
    donate: donate,
    trade: trade,
    bookImg: bookImg,
    bookID: bookID,
    condition: condition
  });
}

app.post('/api/setBooksAvailable', urlParser, function (req, res) {
  setBooksAvailable(req.body.userid, req.body.bookID, req.body.title, req.body.author, req.body.sale, req.body.donate, req.body.trade, req.body.bookImg, req.body.condition);
});





//SET BOOKS AS PENDING
function setPending(userNeededID, userAvailableID, bookNeededID, bookAvailableID, email, book_name_n, book_name_a) {
  admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID).update({"pending":"true"})
  admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID).update({"trade":"true"})
  admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID).update({"tradePartner":userAvailableID})
  admin.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID).update({"tradePartner":userNeededID})
  admin.database().ref('users/' + userNeededID + '/booksAvailable/' + bookAvailableID).update({"pending":"true"})
  admin.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID).update({"pending":"true"})
  admin.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID).update({"trade":"true"})
  admin.database().ref('users/' + userAvailableID + '/booksAvailable/' + bookNeededID).update({"pending":"true"})
  admin.database().ref('users/' + userNeededID).update({"email":email})
  admin.database().ref('users/' + userNeededID).update({"book_name_n":book_name_n})
  admin.database().ref('users/' + userAvailableID).update({"book_name_a":book_name_a})
  admin.database().ref('users/' + userNeededID).update({"book_name_a":book_name_a})
  admin.database().ref('users/' + userAvailableID).update({"book_name_n":book_name_n})
  // console.log("user email: "  + email);
  // console.log("book_name_a: " + book_a)
  // console.log("book_name_n: " + book_n )
}

app.post('/api/setPending', urlParser, function (req, res) {
  setPending(req.body.userNeededID, req.body.userAvailableID, req.body.bookNeededID, req.body.bookAvailableID, req.body.email, req.body.book_name_n, req.body.book_name_a)
});

//SET BOOKS AS PENDING (ONE WAY FOR SALE)
function setPendingOneWay(userNeededID, userAvailableID, bookNeededID, bookAvailableID, email, book_name_n) {
  admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID).update({"pending":"true"})
  admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID).update({"sale":"true"})
  admin.database().ref('users/' + userAvailableID + '/booksAvailable/' + bookAvailableID).update({"pending":"true"})
  admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID).update({"tradePartner":userAvailableID})
  admin.database().ref('users/' + userAvailableID + '/booksAvailable/' + bookAvailableID).update({"tradePartner":userNeededID})
  admin.database().ref('users/' + userNeededID).update({"email":email})
  admin.database().ref('users/' + userNeededID).update({"book_name_n":book_name_n})
  admin.database().ref('users/' + userAvailableID).update({"book_name_n":book_name_n})
  console.log("book_name in set : " + book_name_n);
}

app.post('/api/setPendingOneWay', urlParser, function (req, res) {
  setPendingOneWay(req.body.userNeededID, req.body.userAvailableID, req.body.bookNeededID, req.body.bookAvailableID, req.body.email, req.body.book_name_n)
});

//SET BOOKS AS PENDING (ONE WAY FOR DONATE)
function setPendingOneWay2(userNeededID, userAvailableID, bookNeededID, bookAvailableID, email, book_name_n) {
  admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID).update({"pending":"true"})
  admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID).update({"donate":"true"})
  admin.database().ref('users/' + userAvailableID + '/booksAvailable/' + bookAvailableID).update({"pending":"true"})
  admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID).update({"tradePartner":userAvailableID})
  admin.database().ref('users/' + userAvailableID + '/booksAvailable/' + bookAvailableID).update({"tradePartner":userNeededID})
  admin.database().ref('users/' + userNeededID).update({"email":email})
  admin.database().ref('users/' + userNeededID).update({"book_name_n":book_name_n})
  admin.database().ref('users/' + userAvailableID).update({"book_name_n":book_name_n})
  
}

app.post('/api/setPendingOneWay2', urlParser, function (req, res) {
  setPendingOneWay2(req.body.userNeededID, req.body.userAvailableID, req.body.bookNeededID, req.body.bookAvailableID, req.body.email, req.body.book_name_n)
});


//REMOVE ONE WAY PENDING
function removePendingOneWay(userNeededID, userAvailableID, bookNeededID, bookAvailableID) {
  if (bookAvailableID) {
    admin.database().ref('users/' + userNeededID + '/booksAvailable/' + bookAvailableID + "/pending").remove();
    admin.database().ref('users/' + userNeededID + '/booksAvailable/' + bookAvailableID + "/tradePartner").remove();
    admin.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID + "/pending").remove();
    admin.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID + "/tradePartner").remove();
    admin.database().ref('users/' + userNeededID + '/booksAvailable/' + bookAvailableID + "/confirmed").remove();
    admin.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID + "/confirmed").remove();
  }
  if (bookNeededID) {
    admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID + "/pending").remove();
    admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID + "/sale").remove();
    admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID + "/tradePartner").remove();
    admin.database().ref('users/' + userAvailableID + '/booksAvailable/' + bookNeededID + "/pending").remove();
    admin.database().ref('users/' + userAvailableID + '/booksAvailable/' + bookNeededID + "/tradePartner").remove();
    admin.database().ref('users/' + userAvailableID + '/booksAvailable/' + bookNeededID + "/confirmed").remove();
    admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID + "/confirmed").remove();
  }
  admin.database().ref('users/' + userNeededID + "/messages/" + userAvailableID).remove();
  admin.database().ref('users/' + userAvailableID + "/messages/" + userNeededID).remove();
}

app.post('/api/removePendingOneWay', urlParser, function (req, res) {
  removePendingOneWay(req.body.userNeededID, req.body.userAvailableID, req.body.bookNeededID, req.body.bookAvailableID)
});


//REMOVE ONE WAY PENDING FOR DONATION (DONATE FIELD INSTEAD OF SALE FIELD)
function removePendingOneWay2(userNeededID, userAvailableID, bookNeededID, bookAvailableID) {
  if (bookAvailableID) {
    admin.database().ref('users/' + userNeededID + '/booksAvailable/' + bookAvailableID + "/pending").remove();
    admin.database().ref('users/' + userNeededID + '/booksAvailable/' + bookAvailableID + "/tradePartner").remove();
    admin.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID + "/pending").remove();
    admin.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID + "/tradePartner").remove();
    admin.database().ref('users/' + userNeededID + '/booksAvailable/' + bookAvailableID + "/confirmed").remove();
    admin.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID + "/confirmed").remove();
  }
  if (bookNeededID) {
    admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID + "/pending").remove();
    admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID + "/donate").remove();
    admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID + "/tradePartner").remove();
    admin.database().ref('users/' + userAvailableID + '/booksAvailable/' + bookNeededID + "/pending").remove();
    admin.database().ref('users/' + userAvailableID + '/booksAvailable/' + bookNeededID + "/tradePartner").remove();
    admin.database().ref('users/' + userAvailableID + '/booksAvailable/' + bookNeededID + "/confirmed").remove();
    admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID + "/confirmed").remove();
  }
  admin.database().ref('users/' + userNeededID + "/messages/" + userAvailableID).remove();
  admin.database().ref('users/' + userAvailableID + "/messages/" + userNeededID).remove();
}

app.post('/api/removePendingOneWay2', urlParser, function (req, res) {
  removePendingOneWay2(req.body.userNeededID, req.body.userAvailableID, req.body.bookNeededID, req.body.bookAvailableID)
});


//REMOVES PENDING STATUS
function removePending(userNeededID, userAvailableID, bookNeededID, bookAvailableID) {
  admin.database().ref('users/' + userNeededID + "/messages/" + userAvailableID).remove();
  admin.database().ref('users/' + userAvailableID + "/messages/" + userNeededID).remove();
  admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID + "/pending").remove();
  admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID + "/trade").remove();
  admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID + "/tradePartner").remove();
  admin.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID + "/tradePartner").remove();
  admin.database().ref('users/' + userNeededID + '/booksAvailable/' + bookAvailableID + "/pending").remove();
  admin.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID + "/pending").remove();
  admin.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID + "/trade").remove();
  admin.database().ref('users/' + userAvailableID + '/booksAvailable/' + bookNeededID + "/pending").remove();
  admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID + "/confirmed").remove();
  admin.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID + "/confirmed").remove();
}

app.post('/api/removePending', urlParser, function (req, res) {
  removePending(req.body.userNeededID, req.body.userAvailableID, req.body.bookNeededID, req.body.bookAvailableID)
});

function send_email_user_needed_trade(userNeededID, userAvailableID, bookNeededID, bookAvailableID) {
  var book_1;
  var book_2;
  console.log("inside get users\n")
  var ref1 = admin.database().ref("users/" + userNeededID);  
  ref1.once("value")
  .then(function(snapshot1) {

    var ref2 = admin.database().ref("users/" + userAvailableID);  
    ref2.once("value")
    .then(function(snapshot2) {
      user_needed_email = snapshot1.child("email").val(); 
      user_needed_name = snapshot1.child("firstname").val();
      user_available_email = snapshot2.child("email").val(); 
      user_available_name = snapshot2.child("firstname").val();
      book_1 = snapshot1.child("book_name_n").val(); // tree,  andy
      book_2 = snapshot1.child("book_name_a").val(); // calc berry

          let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
              user: process.env.GMAIL,
              pass: process.env.PASS 
            },
            pool: true
          });
        
          console.log(user_needed_email)
          console.log(user_available_name)
        
          var body = 'Greetings ' + user_needed_name + ',\n'
          + user_available_name + ' has accepted your offer to trade his "' + book_1 + '" for your "' + book_2 + '"  book.\n'
          + 'Your trade has been completed!\n'
          + 'Best, \n'
          + 'BookNet Team'
        
          // send mail with defined transport object
          let info = transporter.sendMail({
            from: '"BookNet Team" <booknet132020@gmail.com>', // sender address
            to: user_needed_email, // list of receivers
            subject: "Trade Has Been Accepted", // Subject line
            text: body // plain text body
          });
        
          console.log("Message sent: %s", info.messageId);
        
          info.catch(console.error);

    });
    
  });

}




function send_email_user_available_trade(userNeededID, userAvailableID, bookNeededID, bookAvailableID) {
  var book_1;
  var book_2;
  console.log("inside get users\n")
  var ref1 = admin.database().ref("users/" + userNeededID);  
  ref1.once("value")
  .then(function(snapshot1) {

    var ref2 = admin.database().ref("users/" + userAvailableID);  
    ref2.once("value")
    .then(function(snapshot2) {
      user_needed_email = snapshot1.child("email").val(); 
      user_needed_name = snapshot1.child("firstname").val();
      user_available_email = snapshot2.child("email").val(); 
      user_available_name = snapshot2.child("firstname").val();
      book_1 = snapshot1.child("book_name_n").val(); //tree, andy needed
      book_2 = snapshot1.child("book_name_a").val(); //calc, andy available
      console.log("book_n: " + snapshot2.child("book_name").val());


        let transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.GMAIL,
            pass: process.env.PASS 
          },
          pool: true
        });
      
        console.log(user_needed_email)
        console.log(user_available_name)
      
        var body = 'Greetings ' + user_available_name + ',\n'
        + user_needed_name + ' has accepted your offer to trade his "' + book_2 + '" for your "' + book_1 + '"  book.\n'
        + 'Your trade has been completed!\n'
        + 'Best, \n'
        + 'BookNet Team'
      
        // send mail with defined transport object
        let info = transporter.sendMail({
          from: '"BookNet Team" <booknet132020@gmail.com>', // sender address
          to: user_available_email, // list of receivers
          subject: "Trade Has Been Accepted", // Subject line
          text: body // plain text body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
        info.catch(console.error);

    });
    
  });

}



//REMOVES ALL POTENTIAL TRADES
function removeTrade(userNeededID, userAvailableID, bookNeededID, bookAvailableID) {
  admin.database().ref('users/' + userNeededID + "/messages/" + userAvailableID).remove();
  admin.database().ref('users/' + userAvailableID + "/messages/" + userNeededID).remove();
  admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID).remove();
  admin.database().ref('users/' + userNeededID + '/booksAvailable/' + bookAvailableID).remove();
  admin.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID).remove();
  admin.database().ref('users/' + userAvailableID + '/booksAvailable/' + bookNeededID).remove();
}

app.post('/api/removeTrade', urlParser, function (req, res) {
  send_email_user_needed_trade(req.body.userNeededID, req.body.userAvailableID, req.body.bookNeededID, req.body.bookAvailableID)
  send_email_user_available_trade(req.body.userNeededID, req.body.userAvailableID, req.body.bookNeededID, req.body.bookAvailableID)
  removeTrade(req.body.userNeededID, req.body.userAvailableID, req.body.bookNeededID, req.body.bookAvailableID)
 
});



/*
 * This is using nodemailer which generates emails to users when 
 * a trade has been accepted. It works with most providers that support 
 * SMTP protocol for email communication.
 * Requires installing nodemailer dependency: npm install nodemailer
 */

function send_email_user_needed(userNeededID, userAvailableID, bookNeededID, bookAvailableID) {
  var book_1;
  //var book_2;
  console.log("inside get users\n")
  var ref1 = admin.database().ref("users/" + userNeededID);  
  ref1.once("value")
  .then(function(snapshot1) {

    var ref2 = admin.database().ref("users/" + userAvailableID);  
    ref2.once("value")
    .then(function(snapshot2) {
      user_needed_email = snapshot1.child("email").val(); 
      user_needed_name = snapshot1.child("firstname").val();
      user_available_email = snapshot2.child("email").val(); 
      user_available_name = snapshot2.child("firstname").val();
      book_1 = snapshot1.child("book_name_n").val();
      //book_2 = snapshot2.child("book_name_a").val();

          let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
              user: process.env.GMAIL,
              pass: process.env.PASS 
            },
            pool: true
          });
        
          console.log(user_needed_email)
          console.log(user_available_name)
        
          var body = 'Greetings ' + user_needed_name + ',\n'
          + user_available_name + ' has accepted your request of purchasing/receiving "' + book_1 + '" book.\n'
          + 'Your trade has been completed!\n'
          + 'Best, \n'
          + 'BookNet Team'
        
          // send mail with defined transport object
          let info = transporter.sendMail({
            from: '"BookNet Team" <booknet132020@gmail.com>', // sender address
            to: user_needed_email, // list of receivers
            subject: "Trade Has Been Accepted", // Subject line
            text: body // plain text body
          });
        
          console.log("Message sent: %s", info.messageId);
        
          info.catch(console.error);

    });
    
  });

}


function send_email_user_available(userNeededID, userAvailableID, bookNeededID, bookAvailableID) {
  var book_1;
  //var book_2;
  console.log("inside get users\n")
  var ref1 = admin.database().ref("users/" + userNeededID);  
  ref1.once("value")
  .then(function(snapshot1) {

    var ref2 = admin.database().ref("users/" + userAvailableID);  
    ref2.once("value")
    .then(function(snapshot2) {
      user_needed_email = snapshot1.child("email").val(); 
      user_needed_name = snapshot1.child("firstname").val();
      user_available_email = snapshot2.child("email").val(); 
      user_available_name = snapshot2.child("firstname").val();
      book_1 = snapshot1.child("book_name_n").val();
      //book_2 = snapshot1.child("book_name_a").val();
      console.log("book_n: " + snapshot2.child("book_name").val());


        let transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.GMAIL,
            pass: process.env.PASS 
          },
          pool: true
        });
      
        console.log(user_needed_email)
        console.log(user_available_name)
      
        var body = 'Greetings ' + user_available_name + ',\n'
        + user_needed_name + ' has accepted your offer to buy/receive "' + book_1 + '" book.\n'
        + 'Your trade has been completed!\n'
        + 'Best, \n'
        + 'BookNet Team'
      
        // send mail with defined transport object
        let info = transporter.sendMail({
          from: '"BookNet Team" <booknet132020@gmail.com>', // sender address
          to: user_available_email, // list of receivers
          subject: "Trade Has Been Accepted", // Subject line
          text: body // plain text body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
        info.catch(console.error);

    });
    
  });

}

//REMOVES ALL POTENTIAL SALES
function removeSale(userNeededID, userAvailableID, bookNeededID, bookAvailableID) {
  if (bookAvailableID) {
    admin.database().ref('users/' + userNeededID + '/booksAvailable/' + bookAvailableID).remove();
    admin.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID).remove();
  }
  if (bookNeededID) {
    admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID).remove();
    admin.database().ref('users/' + userAvailableID + '/booksAvailable/' + bookNeededID).remove();
  }
  admin.database().ref('users/' + userNeededID + "/messages/" + userAvailableID).remove();
  admin.database().ref('users/' + userAvailableID + "/messages/" + userNeededID).remove();
}

app.post('/api/removeSale', urlParser, function (req, res) {
  send_email_user_needed(req.body.userNeededID, req.body.userAvailableID, req.body.bookNeededID, req.body.bookAvailableID);
  send_email_user_available(req.body.userNeededID, req.body.userAvailableID, req.body.bookNeededID, req.body.bookAvailableID);
  removeSale(req.body.userNeededID, req.body.userAvailableID, req.body.bookNeededID, req.body.bookAvailableID)
});



//SETS CONFIRM STATE FOR TRADE
function confirmTrade(userNeededID, bookNeededID) {
  //console.log('users/' + userNeededID + '/booksNeeded/' + bookNeededID)
  admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID).update({"confirmed":"true"})


}

app.post('/api/confirmTrade', urlParser, function (req, res) {
  confirmTrade(req.body.userNeededID, req.body.bookNeededID)
});

//SETS CONFIRM STATE FOR SALE
function confirmSale(userNeededID, bookNeededID, bookAvailableID) {
  //console.log('users/' + userNeededID + '/booksNeeded/' + bookNeededID)
  if (bookAvailableID) {
    admin.database().ref('users/' + userNeededID + '/booksAvailable/' + bookAvailableID).update({"confirmed":"true"})
  }
  if (bookNeededID) {
    admin.database().ref('users/' + userNeededID + '/booksNeeded/' + bookNeededID).update({"confirmed":"true"})
  }
}

app.post('/api/confirmSale', urlParser, function (req, res) {
  confirmSale(req.body.userNeededID, req.body.bookNeededID, req.body.bookAvailableID)
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
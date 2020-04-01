import React, { Component, useCallback } from 'react';
import './home.module.css';
import app from "./base.js";
import axios from "axios"

class Trade extends Component {

  componentDidMount() {
    app.auth().onAuthStateChanged(function (user) {
        var title1;
        var title2;
        var bookIDs1 = [];
        var bookIDs2 = [];
        var tradePartnerIDs = [];
        getPending1(bookIDs1, title1, function(){
          getTradePartnerID(tradePartnerIDs, bookIDs1[0], function() {
          });
        });
        getPending2(bookIDs2, title2, function() {
        });
    });
  }
  componentDidUpdate() {
    app.auth().onAuthStateChanged(function (user) {
      var title1;
      var title2;
      var bookIDs1 = [];
      var bookIDs2 = [];
      var tradePartnerIDs = [];
      getPending1(bookIDs1, title1, function(){
        getTradePartnerID(tradePartnerIDs, bookIDs1[0], function() {
        });
      });
      getPending2(bookIDs2, title2, function() {
      });
  });
  }

  render() {
    return (
        <div>
            <h1>Book you will receive:</h1>
            <h3 id="title1"></h3>
            <h3 id="book1"></h3>
            <h1>Book you will trade:<br /></h1>
            <h3 id="title2"></h3>
            <h3 id="book2"></h3>
            <h3 id="user2"></h3>
            
            <button onClick={ (e) => { confirmTrade(document.getElementById("user2").innerHTML, document.getElementById("book1").innerHTML, document.getElementById("book2").innerHTML);}}>Accept Trade</button>
            <button onClick={ (e) => { removePending(document.getElementById("user2").innerHTML, document.getElementById("book1").innerHTML, document.getElementById("book2").innerHTML);}}>Cancel Trade</button>
            <button onClick={() => window.location.href = '/home'}>Home</button>
        </div>
    );
  }
}

//accept a trade so all books are removed from available and needed lists
function removeTrade(userAvailableID, bookNeededID, bookAvailableID) {
    console.log(userAvailableID)
    if (!userAvailableID) {
      console.log("no trades")
      return;
    }
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        axios.post('/api/removeTrade', {
          userNeededID: user.uid,
          userAvailableID: userAvailableID,
          bookNeededID: bookNeededID,
          bookAvailableID: bookAvailableID
        })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          })
        if (!alert("Trade accepted!")) {
            window.location.reload();
        }
      }
    });
  }


function getPending1(bookIDs, title, callback) {
  app.auth().onAuthStateChanged(function (user) {
    var booksNeededPath = app.database().ref('users/' + user.uid + '/booksNeeded/');
    booksNeededPath.once('value')
        .then(function (snapshot) {
          snapshot.forEach(function (book) {
            console.log(book.child("trade").val())
            if (book.child("pending").val() && book.child("trade").val()) {
              console.log(book.key)
              console.log(book.child("title").val())
              bookIDs.push(book.key)
              title = book.child("title").val();
              document.getElementById("title1").innerHTML = title;
              document.getElementById("book1").innerHTML = bookIDs[0];
              document.getElementById("book1").style.display = "none";
            }
          });  
          callback();
        });
  });
}

function getPending2(bookIDs, title, callback) {
  app.auth().onAuthStateChanged(function (user) {
    var booksNeededPath = app.database().ref('users/' + user.uid + '/booksAvailable/');
    booksNeededPath.once('value')
        .then(function (snapshot) {
          snapshot.forEach(function (book) {
            if (book.child("pending").val() && book.child("trade").val()) {
              console.log(book.key)
              console.log(book.child("title").val())
              bookIDs.push(book.key);
              title = book.child("title").val();
              document.getElementById("title2").innerHTML = title;
              document.getElementById("book2").innerHTML = bookIDs[0];
              document.getElementById("book2").style.display = "none";
            }
          });   
          callback();
        });
  });
}

function getTradePartnerID(tradePartnerIDs, bookID, callback) {
  app.auth().onAuthStateChanged(function (user) {
    var tradePartnerPath = app.database().ref('users/' + user.uid + '/booksNeeded/' + bookID);
    tradePartnerPath.once('value')
      .then(function(snapshot) {
        console.log(snapshot.child("tradePartner").val())
        tradePartnerIDs.push(snapshot.child("tradePartner").val());
        document.getElementById("user2").innerHTML = tradePartnerIDs[0];
        document.getElementById("user2").style.display = "none";
      });
      callback();
  });
}

//cancel a trade so it is no longer pending
function removePending(userAvailableID, bookNeededID, bookAvailableID) {
    if (!userAvailableID) {
      console.log("no trades")
      return;
    }
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        axios.post('/api/removePending', {
          userNeededID: user.uid,
          userAvailableID: userAvailableID,
          bookNeededID: bookNeededID,
          bookAvailableID: bookAvailableID
        })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          })
        if (!alert("Trade cancelled!")) {
            window.location.reload();
        }
      }
    });
  }


  function confirmTrade(userAvailableID, bookNeededID, bookAvailableID) {
    console.log(userAvailableID)
    if (!userAvailableID) {
      console.log("no trades")
      return;
    }
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        //console.log('users/' + user.uid + '/booksNeeded/' + bookNeededID)
        axios.post('/api/confirmTrade', {
          userNeededID: user.uid,
          bookNeededID: bookNeededID
        })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
        console.log('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID)
        var booksNeededPath = app.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID);
        booksNeededPath.once('value')
          .then(function (snapshot) {
            if (snapshot.val().confirmed) {
              console.log("hi")
              removeTrade(document.getElementById("user2").innerHTML, document.getElementById("book1").innerHTML, document.getElementById("book2").innerHTML);
              return;
            }
            else {
              if (!alert("Trade confirmed, waiting on trade partner!")) {
                window.location.reload();
              }
            }
          });
      }
    });
  }


export default Trade;
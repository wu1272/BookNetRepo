import React, { Component, useCallback } from 'react';
import './home.module.css';
import app from "./base.js";
import axios from "axios"

class Donate extends Component {

    componentDidMount() {
        app.auth().onAuthStateChanged(function (user) {
          var title1;
          var bookIDs1 = [];
          var tradePartnerIDs = [];
          var goto2 = [];
          goto2[0] = 'false';
          console.log(goto2[0])
          getPending1(goto2, bookIDs1, title1, function(){
            console.log(goto2)
            if (goto2[0] === 'true') {
                console.log("sdfjsdfk")
                getPending2(bookIDs1, title1, function() {
                    getTradePartnerID2(tradePartnerIDs, bookIDs1[0], function() {
                    });
                }); 
            }
            else {
                getTradePartnerID(tradePartnerIDs, bookIDs1[0], function() {
                });
            }
          });
      });
      }
      componentDidUpdate() {
        app.auth().onAuthStateChanged(function (user) {
            var title1;
            var bookIDs1 = [];
            var tradePartnerIDs = [];
            var goto2 = [];
            goto2[0] = 'false';
            console.log(goto2[0])
            getPending1(goto2, bookIDs1, title1, function(){
              console.log(goto2)
              if (goto2[0] === 'true') {
                  console.log("sdfjsdfk")
                  getPending2(bookIDs1, title1, function() {
                      getTradePartnerID2(tradePartnerIDs, bookIDs1[0], function() {
                      });
                  }); 
              }
              else {
                  getTradePartnerID(tradePartnerIDs, bookIDs1[0], function() {
                  });
              }
            });
        });
        }

  render() {
    return (
        <div>
            <h1>Book you will receive:</h1>
            <h3 id="title1"></h3>
            <h3 id="book1"></h3>
            <h1>Book you will donate:<br /></h1>
            <h3 id="title2"></h3>
            <h3 id="book2"></h3>
            <h3 id="user2"></h3>
            
            <button onClick={ (e) => { confirmSale(document.getElementById("user2").innerHTML, document.getElementById("book1").innerHTML, document.getElementById("book2").innerHTML);}}>Accept Sale</button>
            <button onClick={ (e) => { removePendingOneWay(document.getElementById("user2").innerHTML, document.getElementById("book1").innerHTML, document.getElementById("book2").innerHTML);}}>Cancel Sale</button>
            <button onClick={() => window.location.href = '/home'}>Home</button>
        </div>
    );
  }
}

//accept a trade so all books are removed from available and needed lists
function removeSale(userAvailableID, bookNeededID, bookAvailableID) {
    console.log(userAvailableID)
    if (!userAvailableID) {
      console.log("no sales")
      return;
    }
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        axios.post('/api/removeSale', {
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
        if (!alert("Sale accepted!")) {
            window.location.reload();
        }
      }
    });
  }


//IF YOUR BOOK NEEDED
function getPending1(goto2, bookIDs, title, callback) {
  app.auth().onAuthStateChanged(function (user) {
    var wtf = false;
    var booksNeededPath = app.database().ref('users/' + user.uid + '/booksNeeded/');
    booksNeededPath.once('value')
        .then(function (snapshot) {
          snapshot.forEach(function (book) {
              console.log(book.val())
              console.log(book.child("pending").val())
              console.log(book.child("donate").val())
            if (book.child("pending").val()) {
              console.log(book.key)
              console.log(book.child("title").val())
              console.log(book.child("donate").val())

              if (book.child("donate").val()) {
                bookIDs.push(book.key)
                title = book.child("title").val();
                
                document.getElementById("title1").innerHTML = title;
                document.getElementById("book1").innerHTML = bookIDs[0];
                document.getElementById("book1").style.display = "none";
                wtf = true;
              }
            }
          });
          if (!wtf) {
            goto2[0] = 'true'
            console.log(goto2)
          }
          callback();
        });
  });
}

//IF YOUR BOOK AVAILABLE
function getPending2(bookIDs, title, callback) {
  app.auth().onAuthStateChanged(function (user) {
    var booksNeededPath = app.database().ref('users/' + user.uid + '/booksAvailable/');
    booksNeededPath.once('value')
        .then(function (snapshot) {
          snapshot.forEach(function (book) {
            console.log(book.val())
            console.log(book.child("donate").val())
            console.log(book.child("pending").val() === 'true')
            if (book.child("pending").val() && book.child("donate").val()) {
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
        //document.getElementById("user2").style.display = "none";
      });
      callback();
  });
}

function getTradePartnerID2(tradePartnerIDs, bookID, callback) {
  app.auth().onAuthStateChanged(function (user) {
    var tradePartnerPath = app.database().ref('users/' + user.uid + '/booksAvailable/' + bookID);
    console.log('users/' + user.uid + '/booksAvailable/' + bookID)
    tradePartnerPath.once('value')
      .then(function(snapshot) {
        console.log(snapshot.child("tradePartner").val())
        tradePartnerIDs.push(snapshot.child("tradePartner").val());
        document.getElementById("user2").innerHTML = tradePartnerIDs[0];
        console.log(tradePartnerIDs[0])
        //document.getElementById("user2").style.display = "none";
      });
      callback();
  });
}

//cancel a trade so it is no longer pending
function removePendingOneWay(userAvailableID, bookNeededID, bookAvailableID) {
    console.log(bookNeededID)
    console.log(bookAvailableID)
    if (!userAvailableID) {
      console.log("no trades")
      return;
    }
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        axios.post('/api/removePendingOneWay2', {
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
        if (!alert("Donation cancelled!")) {
            window.location.reload();
        }
      }
    });
  }


  function confirmSale(userAvailableID, bookNeededID, bookAvailableID) {
    console.log(userAvailableID)
    if (!userAvailableID) {
      console.log("no trades")
      return;
    }
    app.auth().onAuthStateChanged(function (user) {
        console.log(bookNeededID)
        console.log(bookAvailableID)
      if (user) {
        //console.log('users/' + user.uid + '/booksNeeded/' + bookNeededID)
        axios.post('/api/confirmSale', {
          userNeededID: user.uid,
          bookNeededID: bookNeededID,
          bookAvailableID: bookAvailableID
        })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
        console.log('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID)
        var booksNeededPath;
        if (bookAvailableID) {
            booksNeededPath = app.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID);
        }
        if (bookNeededID) {
            booksNeededPath = app.database().ref('users/' + userAvailableID + '/booksAvailable/' + bookNeededID);
        }
        booksNeededPath.once('value')
          .then(function (snapshot) {
            if (snapshot.val().confirmed) {
              console.log("hi")
              removeSale(document.getElementById("user2").innerHTML, document.getElementById("book1").innerHTML, document.getElementById("book2").innerHTML);
              return;
            }
            else {
              if (!alert("Donation confirmed, waiting on donation partner!")) {
                window.location.reload();
              }
            }
          });
      }
    });
  }


export default Donate;
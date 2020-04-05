import React, { Component } from 'react';
import app from "./base.js";
import styles from "./matches.module.css"
import axios from "axios";

var tradeMatches = []
var saleMatches = []
var donateMatches = []


class Match extends Component {

    

    componentDidMount() {
        app.auth().onAuthStateChanged(function (user) {
            if (user) {
                var bookIDs = [];
                var bookAvailableIDs = [];
                var allBookIDsAvailable = [];
                var allBookIDsNeeded = [];
                var allUserIDsAvailable = [];
                var availableInYourDir = [];  //actual book objects
                getBooksNeededIDs(bookIDs, user.uid, function () {
                    //console.log(bookIDs);
                    getBooksAvailableIDs(bookAvailableIDs, user.uid, function() {
                        
                    
                    getEverySingleDamnBookNeeded(allBookIDsNeeded, function() {
                        
                    
                    getEverySingleDamnBookAvailable(allUserIDsAvailable, allBookIDsAvailable, function () {

                        preventPendingTrades(availableInYourDir, user.uid, function() {
                        //console.log(availableInYourDir)
                        //console.log(allBookIDsAvailable);
                        //console.log(bookIDs);
                        //console.log(allBookIDsNeeded.length);
                        for (var i = 0; i < allBookIDsAvailable.length; i++) {
                            for (var j = 0; j < bookIDs.length; j++) {
                                //console.log(allBookIDsAvailable[i])
                                // if (allBookIDsAvailable[i] === null) {
                                //     console.log("rip")
                                //     displayMatches()
                                //     return;
                                // }
                                // if (allBookIDsNeeded[i] === null) {
                                //     console.log("rip")
                                //     displayMatches()
                                //     return;
                                // }  
                                
                                
                                if(allBookIDsAvailable[i] === null || bookIDs[j] === null) {
                                    break
                                }

                                var bookbook = allBookIDsAvailable[i][bookIDs[j]];
                                if (bookbook !== undefined) {
                                    //console.log(bookbook);
                                    var btn = document.createElement("button");
                                    var typeOfMatch;

                                    //set css
                                    btn.style.width = "100%"
                                    btn.style.padding = '15px'
                                    

                                    //set values 
                                    btn.setAttribute("value", bookIDs[j]);
                                    btn.setAttribute("text", bookbook.title);

                                    //Add to proper list
                                    //book I need   ---- book you have available... done above
                                    //book you need ---- book I have available... do below
                                    if (bookbook.trade) {
                                        for (var a = 0; a < allBookIDsNeeded.length; a++) {
                                            for (var b = 0; b < bookAvailableIDs.length; b++) {
                                                if(allBookIDsNeeded[a]){
                                                    if (allBookIDsNeeded[a][bookAvailableIDs[b]] !== undefined) {
                                                        //console.log("hallelujah")
                                                        var btn = document.createElement("button");
                                                        btn.style.width = "100%"
                                                        btn.style.padding = '15px'
                                                        typeOfMatch = "trade";
                                                        btn.id = [bookAvailableIDs[b]];
                                                        //bookbook.title is the one they have and I need
                                                        //allBookIDsNeeded[a][bookAvailableIDs[b]] is the one I have and they need
                                                        btn.innerHTML = bookbook.title + "<br/>for your<br/>" + allBookIDsNeeded[a][bookAvailableIDs[b]].title;
                                                        btn.setAttribute("typeOfMatch", typeOfMatch)
                                                        btn.onclick = (function(userAvailableID, bookNeededID, bookAvailableID) {
                                                            return function() {
                                                                setPending(userAvailableID, bookNeededID, bookAvailableID)
                                                            };
                                                            }(allUserIDsAvailable[i], bookIDs[j], bookAvailableIDs[b]));


                                                        //does not show button when books are pending
                                                        //i.e. when someone clicks the match with you, removes the button
                                                        //console.log(availableInYourDir)
                                                        for (var y = 0; y < availableInYourDir.length; y++) {
                                                            if (availableInYourDir[y].title === allBookIDsNeeded[a][bookAvailableIDs[b]].title) {
                                                                if (!availableInYourDir[y].pending && availableInYourDir[y].trade) {
                                                                    tradeMatches.push(btn);
                                                                }
                                                            }
                                                        }
                                                        
                                                    }
                                                }
                                            }
                                            
                                        }
                                    }
                                    if (bookbook.sale) {

                                        if (!allBookIDsAvailable[i][bookIDs[j]].pending) {
                                            saleMatches.push(createBookListing(bookbook, allUserIDsAvailable[i], bookIDs[j], bookAvailableIDs[b], "S"))
                                        }    

                                                                            
                                                
                                    }
                                    if (bookbook.donate) {
                                        var btn = document.createElement("button");
                                        btn.style.width = "100%"
                                        btn.style.padding = '15px'
                                        typeOfMatch = "donate";
                                        //1 way match so same book for available and needed now
                                        btn.innerHTML = bookbook.title;
                                        btn.setAttribute("typeOfMatch", typeOfMatch)
                                        //console.log(bookIDs[j])
                                        btn.onclick = (function(userAvailableID, bookNeededID, bookAvailableID) {
                                            return function() {
                                              setPendingDonate(userAvailableID, bookNeededID, bookAvailableID)
                                            };
                                          }(allUserIDsAvailable[i], bookIDs[j], bookIDs[j]));
                                        //console.log(allBookIDsAvailable[i][bookIDs[j]]);
                                        if (!allBookIDsAvailable[i][bookIDs[j]].pending) {
                                            donateMatches.push(btn)
                                        } 
                                    }
                                
                                }
                            }
                        }

                        displayMatches()
                    });
                });
                });
            });
        });
            }
        })
    
    }



    render() {
        return (
            <div>
                <h1>Find Matches Here</h1>
                <p>Click a book to be paired with a trading partner</p>
                <button onClick={() => window.location.href = '/home'}>Home</button>
                <div id="matchesList"></div>
            </div>
        );
    }
}

function listingCallBack(userId, bNeedId, bAvailId, method) {
    
    switch(method) {
        case "T":
            break
        case "S":
            setPendingSale(userId, bNeedId, bAvailId)
            break
        case "D":
            break
    }
    
}


function createBookListing(book, userId, bNeedId, bAvailId, method) {

    var listing = document.createElement('img')
    listing.src = book.bookImg
    listing.className = styles.listing
    listing.onclick = function() {
        listingCallBack(userId, bNeedId, bAvailId, method)
    }

    return listing 


}


//Display matches with respect to match type 
function displayMatches() {

        console.log("Displaying matches")

        //Get div to add matches to 
        var list = document.getElementById("matchesList");

        //Display trade matches first
        var trades = document.createElement("div")
        trades.className = "wrapper"
        trades.style.height = "auto"
        var tradesInner = document.createElement("div")
        tradesInner.className = "form-wrapper"

        //Create title for trades list
        var tradesTitle = document.createElement("h1")
        tradesTitle.innerHTML = "Available Trades"
        tradesTitle.style.textDecoration = "underline"
        tradesInner.appendChild(tradesTitle)

        tradeMatches.forEach(item => {
            tradesInner.appendChild(item)
        })
        trades.appendChild(tradesInner)
        list.appendChild(trades)

         //Display donate matches 
         var donations = document.createElement("div")
         donations.className = "wrapper"
         donations.style.height = "auto"
         donations.style.marginTop = "10px"
         var donationsInner = document.createElement("div")
         donationsInner.className = "form-wrapper"

         //Create title
         var donationsTitle = document.createElement("h1")
         donationsTitle.innerHTML = "Available Donations"
         donationsTitle.style.textDecoration = "underline"
         donationsInner.appendChild(donationsTitle)

         donateMatches.forEach(item => {
             donationsInner.appendChild(item)
         })
         donations.appendChild(donationsInner)
         list.appendChild(donations)


        //Display sale options
        var sales = document.createElement("div")
        sales.className="wrapper"
        sales.style.height = "auto"
        sales.style.marginTop = "10px"
        var salesInner = document.createElement("div")
        salesInner.className="form-wrapper"

        var salesSlider = document.createElement("div")
        salesSlider.className = styles.slider


        var salesTitle = document.createElement('h1')
        salesTitle.innerHTML = "Available Sales"
        salesTitle.style.textDecoration = "underline"
        salesInner.appendChild(salesTitle)

        saleMatches.forEach(item => {
            salesSlider.appendChild(item)
        })
        salesInner.appendChild(salesSlider)
        sales.appendChild(salesInner)
        list.appendChild(sales)


        
}

//get ALL booksNeeded IDs from database     
function getBooksNeededIDs(bookIDs, userID, callback) {
    var booksNeededPath = app.database().ref('users/' + userID + '/booksNeeded/');
    booksNeededPath.once('value')
        .then(function (snapshot) {
            snapshot.forEach(function (child) {
                var bookID = child.key;
                bookIDs.push(bookID);
            });
            callback();
        });
}

function getBooksAvailableIDs(bookIDs, userID, callback) {
    var booksAvailablePath = app.database().ref('users/' + userID + '/booksAvailable/');
    booksAvailablePath.once('value')
        .then(function (snapshot) {
            snapshot.forEach(function (child) {
                var bookID = child.key;
                bookIDs.push(bookID);
            });
            callback();
        });
}

function preventPendingTrades(bookIDs, userID, callback) {
    var booksAvailablePath = app.database().ref('users/' + userID + '/booksAvailable/');
    booksAvailablePath.once('value')
        .then(function (snapshot) {
            snapshot.forEach(function (child) {
                bookIDs.push(child.val());
            });
            callback();
        });
}

function getEverySingleDamnBookAvailable(allUserIDsAvailable, allBookIDsAvailable, callback) {
    var booksAvailablePath = app.database().ref('users/');
    booksAvailablePath.once('value')
        .then(function (snapshot) {
            snapshot.forEach(function (user) {
                //console.log(user.key)
                var bookID = user.child("booksAvailable").val();
                allBookIDsAvailable.push(bookID);
                allUserIDsAvailable.push(user.key);
            });
            callback();
        });
}

function getEverySingleDamnBookNeeded(allBookIDsNeeded, callback) {
    var booksNeededPath = app.database().ref('users/');
    booksNeededPath.once('value')
        .then(function (snapshot) {
            snapshot.forEach(function (user) {
                var bookID = user.child("booksNeeded").val();
                allBookIDsNeeded.push(bookID);
            });
            callback();
        });
}

function setPending(userAvailableID, bookNeededID, bookAvailableID) {
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        axios.post('/api/setPending', {
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
        if (!alert("Please proceed with your trade")) {
          window.location.href = "/trade"
        }
      }
    });
  }

  function setPendingSale(userAvailableID, bookNeededID, bookAvailableID) {
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        axios.post('/api/setPendingOneWay', {
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
        if (!alert("Please proceed with the sale")) {
          window.location.href = "/sale"
        }
      }
    });
  }

  function setPendingDonate(userAvailableID, bookNeededID, bookAvailableID) {
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        axios.post('/api/setPendingOneWay2', {
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
        if (!alert("Please proceed with the donation")) {
          window.location.href = "/donate"
        }
      }
    });
  }

export default Match;
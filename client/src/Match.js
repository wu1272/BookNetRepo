import React, { Component } from 'react';
import app from "./base.js";

var tradeMatches = []
var saleMatches = []
var donateMatches = []


class Match extends Component {

    

    componentDidMount() {
        app.auth().onAuthStateChanged(function (user) {
            if (user) {
                var bookIDs = [];
                var allBookIDs = [];
                getBooksNeededIDs(bookIDs, user.uid, function () {
                    //console.log(bookIDs);

                    getEverySingleDamnBookAvailable(allBookIDs, function () {
                        //console.log(allBookIDs);
                        //console.log(bookIDs);
                        for (var i = 0; i < allBookIDs.length; i++) {
                            for (var j = 0; j < bookIDs.length; j++) {
                                var bookbook = allBookIDs[i][bookIDs[j]];
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
                                    if (bookbook.trade) {
                                        typeOfMatch = "trade";
                                        btn.innerHTML = bookbook.title;
                                        btn.setAttribute("typeOfMatch", typeOfMatch)
                                        tradeMatches.push(btn)
                                    }
                                    if (bookbook.sale) {
                                        typeOfMatch = "sale";
                                        btn.innerHTML = bookbook.title
                                        btn.setAttribute("typeOfMatch", typeOfMatch)
                                        saleMatches.push(btn)
                                    }
                                    if (bookbook.donate) {
                                        typeOfMatch = "donate";
                                        btn.innerHTML = bookbook.title
                                        btn.setAttribute("typeOfMatch", typeOfMatch)
                                        donateMatches.push(btn)
                                    }
                                
                                }
                            }
                        }

                        displayMatches()
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
                <div id="matchesList"></div>
            </div>
        );
    }
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

        var salesTitle = document.createElement('h1')
        salesTitle.innerHTML = "Available Sales"
        salesTitle.style.textDecoration = "underline"
        salesInner.appendChild(salesTitle)

        saleMatches.forEach(item => {
            salesInner.appendChild(item)
        })
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

function getEverySingleDamnBookAvailable(allBookIDs, callback) {
    var booksNeededPath = app.database().ref('users/');
    booksNeededPath.once('value')
        .then(function (snapshot) {
            snapshot.forEach(function (user) {
                var bookID = user.child("booksAvailable").val();
                allBookIDs.push(bookID);
            });
            callback();
        });
}


export default Match;
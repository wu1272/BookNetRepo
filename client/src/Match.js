import React, { Component } from 'react';
import app from "./base.js";

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
                                    var btn = document.createElement("BUTTON");
                                    var typeOfMatch;
                                    if (bookbook.trade) {
                                        typeOfMatch = "trade";
                                        btn.innerHTML = bookbook.title + " " + typeOfMatch;
                                        btn.style.width = '200px';
                                        btn.style.marginLeft = '50%';
                                        btn.style.position = 'relative';
                                        btn.style.left = '-100px';
                                    }
                                    if (bookbook.sale) {
                                        typeOfMatch = "sale";
                                        btn.innerHTML = bookbook.title + " " + typeOfMatch;
                                        btn.style.width = '200px';
                                        btn.style.marginLeft = '50%';
                                        btn.style.position = 'relative';
                                        btn.style.left = '-100px';
                                    }
                                    if (bookbook.donate) {
                                        typeOfMatch = "donate";
                                        btn.innerHTML = bookbook.title + " " + typeOfMatch;
                                        btn.style.width = '200px';
                                        btn.style.marginLeft = '50%';
                                        btn.style.position = 'relative';
                                        btn.style.left = '-100px';
                                    }
                                    btn.setAttribute("typeOfMatch", typeOfMatch)
                                    btn.setAttribute("value", bookIDs[j]);
                                    btn.setAttribute("text", bookbook.title);
                                    document.body.appendChild(btn);
                                }
                            }
                        }
                    });
                });

            }
        });
    }


    render() {
        return (
            <div>
                <h1>Find Matches Here</h1>
                <p1>Click a book to be paired with a trading partner</p1>
            </div>
        );
    }
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
import React, { Component } from 'react';
import './home.module.css';
import app from "./base.js";
import axios from "axios";

class BooksAvailable extends Component {

  componentDidMount() {
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        var titles = [];
        var bookIDs = [];
        getBooksAvailableIDs(bookIDs, user.uid, function () {
          //console.log(bookIDs);

          getBooksAvailable(titles, user.uid, function () {
            //document.getElementById("p3").innerHTML = titles;
            for (var i = 0; i < titles.length; i++) {
              var title = titles[i];
              var bookID = bookIDs[i];
              //console.log(title);
              //console.log(bookID);
              var btn = document.createElement("BUTTON");
              btn.id = i;
              var id;
              btn.innerHTML = title;
              btn.setAttribute("value", bookID);
              btn.setAttribute("index", i);
              btn.setAttribute("text", title);
              document.body.appendChild(btn);
              btn.onclick = (function(id) {
                return function() {
                  //console.log(id)
                  deleteBooksAvailable(id)
                };
              }(bookIDs[i]));
            }
          });
        });
      }
    });
  }


  render() {
    return (
      <div>
        <h1>Books Available</h1>
        <p1>Click a book to remove it from your list of available books.</p1>
      </div>
    );
  }
}

//get ALL booksAvailable from database     
function getBooksAvailable(titles, userID, callback) {
  var booksAvailablePath = app.database().ref('users/' + userID + '/booksAvailable/');
  booksAvailablePath.once('value')
    .then(function (snapshot) {
      snapshot.forEach(function (child) {
        var title = child.child("title").val();
        titles.push(title);
      });
      callback();
    });
}
//get ALL booksAvailable IDs from database     
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

function deleteBooksAvailable(bookID) {
  app.auth().onAuthStateChanged(function (user) {
    if (user) {
      //console.log(user.uid)
      //console.log(bookID)
      axios.post('/api/bookAvailableRemove', {
        userid: user.uid,
        bookID: bookID
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        })
      if (!alert("Deletion successful")) {
        window.location.reload();
      }
    }
  });
}

export default BooksAvailable;
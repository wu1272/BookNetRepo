import React, { Component } from 'react';
import app from "./base.js";
import axios from "axios";

class BooksAvailable extends Component {

  componentDidMount() {
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        var titles = [];
        var bookIDs = [];
        var authors = [];
        getBooksAvailableIDs(bookIDs, user.uid, function () {
          //console.log(bookIDs);

          getBooksAvailable(authors, titles, user.uid, function () {
            //document.getElementById("p3").innerHTML = titles;
            for (var i = 0; i < titles.length; i++) {
              var title = titles[i];
              var bookID = bookIDs[i];
              var author = authors[i];
              if (author == null) {
                author = "Unknown";
              }
              //console.log(title);
              //console.log(bookID);
              var btn = document.createElement("BUTTON");
              btn.id = i;
              btn.innerHTML = title + "<br /><br />By: " + author;
              btn.setAttribute("value", bookID);
              btn.setAttribute("index", i);
              btn.setAttribute("text", title);
              document.body.appendChild(btn);
              btn.style.width = '200px';
              btn.style.marginLeft = '50%';
              btn.style.position = 'relative';
              btn.style.left = '-100px';
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
function getBooksAvailable(authors, titles, userID, callback) {
  var booksAvailablePath = app.database().ref('users/' + userID + '/booksAvailable/');
  booksAvailablePath.once('value')
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
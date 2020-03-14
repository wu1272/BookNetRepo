import React, { Component } from 'react';
import app from "./base.js";
import axios from "axios";

class BooksNeeded extends Component {

  componentDidMount() {
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        var titles = [];
        var bookIDs = [];
        getBooksNeededIDs(bookIDs, user.uid, function () {
          //console.log(bookIDs);

          getBooksNeeded(titles, user.uid, function () {
            //document.getElementById("p3").innerHTML = titles;
            for (var i = 0; i < titles.length; i++) {
              var title = titles[i];
              var bookID = bookIDs[i];
              //console.log(title);
              //console.log(bookID);
              var btn = document.createElement("BUTTON");
              btn.id = i;
              btn.innerHTML = title;
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
                  deleteBooksNeeded(id)
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
        <h1>Books Needed</h1>
        <p1>Click a book to remove it from your list of needed books.</p1>
      </div>
    );
  }
}

//get ALL booksNeeded from database     
function getBooksNeeded(titles, userID, callback) {
  var booksNeededPath = app.database().ref('users/' + userID + '/booksNeeded/');
  booksNeededPath.once('value')
    .then(function (snapshot) {
      snapshot.forEach(function (child) {
        var title = child.child("title").val();
        titles.push(title);
      });
      callback();
    });
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

function deleteBooksNeeded(bookID) {
  app.auth().onAuthStateChanged(function (user) {
    if (user) {
      //console.log(user.uid)
      //console.log(bookID)
      axios.post('/api/bookNeededRemove', {
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

export default BooksNeeded;
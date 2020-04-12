import React, { Component } from 'react';
import app from "./base.js";
import axios from "axios";
import Modal from "react-modal"

class BooksNeeded extends Component {

  componentDidMount() {
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        var titles = [];
        var bookIDs = [];
        var authors = [];
        getBooksNeededIDs(bookIDs, user.uid, function () {
          //console.log(bookIDs);

          getBooksNeeded(authors, titles, user.uid, function () {
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
                  deleteBooksNeeded(id)
                };
              }(bookIDs[i]));
              // btn.onclick = (function(title) {
              //   return function() {
              //     searchOnBarnes(title)
              //   };
              // }(titles[i]));
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
        <p>Select a book to see options!<br></br></p>
        <p>Click here to remove a book from your list of books needed.<br></br></p>
        <p>Select a retailer here to search for the book being sold online.<br></br></p>
      </div>
    );
  }
}

//get ALL booksNeeded from database     
function getBooksNeeded(authors, titles, userID, callback) {
  var booksNeededPath = app.database().ref('users/' + userID + '/booksNeeded/');
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

function searchOnBarnes(title) {
  window.open('https://www.barnesandnoble.com/s/'+title);
}
function searchOnAmazon(title) {
  window.open('https://www.amazon.com/s?k='+title);
}
function searchOnFollets(title) {
  window.open('https://www.bkstr.com/purduestore/search/keyword/'+title);
}

export default BooksNeeded;
import React, { Component } from 'react';
import app from "./base.js";
import axios from "axios";
import Modal from "react-modal"

class BooksNeeded extends Component {

  componentDidMount() {
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        var bookIDs = [];
        var books = []
        getBooksNeededIDs(bookIDs, user.uid, function () {
          //console.log(bookIDs);

          getBooksNeeded(books, user.uid, function () {
            //document.getElementById("p3").innerHTML = titles;
            for (var i = 0; i < books.length; i++) {
              
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
        <div id="slider" className="slider">

        </div>
      </div>
    );
  }
}

//get ALL booksNeeded from database     
function getBooksNeeded(books, userID, callback) {
  var booksNeededPath = app.database().ref('users/' + userID + '/booksNeeded/');
  booksNeededPath.once('value')
    .then(function (snapshot) {
      snapshot.forEach(function (child) {
        books.push(child)
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
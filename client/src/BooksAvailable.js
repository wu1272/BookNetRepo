import React, { Component } from 'react';
import app from "./base.js";
import axios from "axios";
import styles from "./search.module.css"

class BooksAvailable extends Component {

  componentDidMount() {
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        var bookIDs = [];
        let books = [];
        getBooksAvailableIDs(bookIDs, user.uid, function () {
          //console.log(bookIDs);

          getBooksAvailable(books, user.uid, function () {
            //document.getElementById("p3").innerHTML = titles;
          
            for (var i = 0; i < books.length; i++) {
                document.getElementById("slider").appendChild(createListing(books[i]))
            }
          });
        });
      }
    });
  }


  render() {
    return (
      <div className={styles.moddedWrap}>
      <div className={styles.moddedFormWrap}>
        <h1>Books Available</h1>
        <p>Click a book to remove it from your list of available books.</p>
        <div id="slider" className="slider">

        </div>
      </div>
      </div>
    );
  }
}

//Create listing element 
function createListing(book) {

  var listing = document.createElement('img')
  listing.src = book.child("bookImg").val()
  listing.className = "listing"
  listing.alt = book.child("title").val()
  
  listing.onclick = () => {
    deleteBooksAvailable(book.key)
  }
  return listing

}

//get ALL booksAvailable from database     
function getBooksAvailable(books, userID, callback) {
  var booksAvailablePath = app.database().ref('users/' + userID + '/booksAvailable/');
  booksAvailablePath.once('value')
    .then(function (snapshot) {
      snapshot.forEach(function (child) {
        books.push(child)
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
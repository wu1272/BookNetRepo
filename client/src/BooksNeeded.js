import React, { Component, useState } from 'react';
import app from "./base.js";
import axios from "axios";
import Modal from "react-modal"
import styles from "./search.module.css"

// CSS style for modal popout 

const customStyles = {

  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};
 
class BooksNeeded extends Component {

  constructor() {
    super()

    this.state = {
      isModalOpen: false,
      currBook: null
    }

    this.createListing = this.createListing.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentDidMount() {
    app.auth().onAuthStateChanged((user) =>  {
      if (user) {
        var bookIDs = [];
        var books = []
        getBooksNeededIDs(bookIDs, user.uid, () => {
          //console.log(bookIDs);
          getBooksNeeded(books, user.uid, () => {
            //document.getElementById("p3").innerHTML = titles;
            for (var i = 0; i < books.length; i++) {
              document.getElementById("slider").appendChild(this.createListing(books[i]))
            }
          });
        });
      }
    });
  }

  //Create listing element 
  createListing(book) {
    var listing = document.createElement('img')
    listing.src = book.child("bookImg").val()
    listing.className = "listing"
    listing.alt = book.child("title").val()
 
    listing.onclick = () => {
      this.setState({isModalOpen: true, currBook: book})
    }
    return listing
  }

  deleteCurrentBook(e) {
    e.preventDefault()
    if(this.state.currBook) 
    deleteBooksNeeded(this.state.currBook.key)
  }

  searchOnBarnes(e) {
    window.open('https://www.barnesandnoble.com/s/'+this.state.currBook.child("title").val());
  }

  searchOnFollets(e) {
    window.open('https://www.bkstr.com/purduestore/search/keyword/'+this.state.currBook.child("title").val());
  }

  searchOnAmazon(e) {
    window.open('https://www.amazon.com/s?k='+this.state.currBook.child("title").val()+"&i=stripbooks&ref=nb_sb_noss"); 
  }
  
  afterOpenModal() {}
  closeModal() {
    this.setState({isModalOpen: false})
  }
 
  render() {
    return (
      <div className={styles.moddedWrap}>
      <div className={styles.moddedFormWrap}>
        <Modal 
          contentLabel="Upload profile image"
          isOpen={this.state.isModalOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          >

          <button onClick={(e) => this.deleteCurrentBook(e)}>Remove Needed Book</button>   

          <p><br></br>Or purchase online:</p>
          <button onClick={(e) => this.searchOnBarnes(e)}>Barnes</button>
          <button onClick={(e) => this.searchOnFollets(e)}>Follets</button>
          <button onClick={(e) => this.searchOnAmazon(e)}>Amazon</button>
        </Modal>
 
        <h1>Books Needed</h1>

        <p>Select a book to see options!<br></br></p>
        <p>You may remove a book that you no longer need or search for a book you still need online.<br></br></p>
        <div id="slider" className="slider">

        </div>
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


export default BooksNeeded;
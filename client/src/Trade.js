import React, { Component } from 'react';
import './home.module.css';
import app from "./base.js";
import axios from "axios"

class Trade extends Component {

  componentDidMount() {
    app.auth().onAuthStateChanged(function (user) {
        // console.log(localStorage.getItem("user2"));
        // console.log(localStorage.getItem("bookNeeded"));
        // console.log(localStorage.getItem("bookAvailable"));
        var user2 = localStorage.getItem("user2");
        var bookNeeded = localStorage.getItem("bookNeeded");
        var bookAvailable = localStorage.getItem("bookAvailable");
        var book1;
        var book2;
        getBookNeeded(book1, bookNeeded);
        getBookAvailable(book2, bookAvailable);
    });
  }

  render() {
    return (
        <div>
            <h1>Book you will trade:</h1>
            <h3 id="book1"></h3>
            <h1>Book you will receive:<br /></h1>
            <h3 id="book2"></h3>
            <button onClick={ (e) => { removeAll(localStorage.getItem("user2"), localStorage.getItem("bookNeeded"), localStorage.getItem("bookAvailable"));}}>Accept Trade</button>
            <button onClick={ (e) => { removePending(localStorage.getItem("user2"), localStorage.getItem("bookNeeded"), localStorage.getItem("bookAvailable"));}}>Cancel Trade</button>
            <button onClick={() => window.location.href = '/home'}>Home</button>
        </div>
    );
  }
}

//accept a trade so all books are removed from available and needed lists
function removeAll(userAvailableID, bookNeededID, bookAvailableID) {
    app.auth().onAuthStateChanged(function (user) {
      if (user) {

        //track it to api/bookNeededRemove

        axios.post('/api/....................', {
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


        //track another axios.post to api/bookAvailableRemove


        if (!alert("Trade accepted!")) {
            window.location.reload();
        }
      }
    });
  }

//cancel a trade so it is no longer pending
function removePending(userAvailableID, bookNeededID, bookAvailableID) {
    console.log(bookNeededID)
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        axios.post('/api/removePending', {
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
        if (!alert("Trade cancelled!")) {
            window.location.reload();
        }
      }
    });
  }



function getBookNeeded(book1, bookNeeded) {
    app.auth().onAuthStateChanged(function (user) {
        var booksNeededPath = app.database().ref('users/' + user.uid + '/booksNeeded/' + bookNeeded);
        booksNeededPath.once('value')
            .then(function (snapshot) {
                book1 = snapshot.child("title").val();
                //console.log(book1)
                document.getElementById("book1").innerHTML = book1;
            });
    });
}


function getBookAvailable(book2, bookAvailable) {
    app.auth().onAuthStateChanged(function (user) {
        var booksAvailablePath = app.database().ref('users/' + user.uid + '/booksAvailable/' + bookAvailable);
        booksAvailablePath.once('value')
            .then(function (snapshot) {
                book2 = snapshot.child("title").val();
                //console.log(book2)
                document.getElementById("book2").innerHTML = book2;
            });
    });
}

export default Trade;
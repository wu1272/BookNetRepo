import React, { Component } from 'react';
import './home.module.css';
import app from "./base.js";

class BooksNeeded extends Component {
  constructor() {
    super();
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        var titles = [];
        getBooksNeeded(titles, user.uid, function () {
          console.log(titles);
        });
      }
    });
  }
  


  render() {
    return (
      <section class="wrapper">
        <div class="form-wrapper">
          <h1>Hello <span id="emailAddress"></span>!</h1>
          <h2>Users</h2>
          <ul>
            {/* {this.state.titles.map(user =>
              <li key={user.id}>{user.firstName} {user.lastName}</li>
            )} */}
          </ul>
        </div>
        
      </section>
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

export default BooksNeeded;
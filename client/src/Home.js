import React, { Component } from 'react';
import './home.module.css';
import app from "./base.js";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

var pendingCounter = 0;
var titles = [];

class Home extends Component {

  componentDidMount() {
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        document.getElementById("emailAddress").innerHTML = user.email;

        /*
         * Get the reference to the database for the current user.
         * Access the path "users/<user.uid>/bookNeeded" and loop
         * through all of the books needed. When looping look for books
         * with pending state, increase counter for numPending and add the
         * the title of the book the titles array
         */
        var ref = app.database().ref("users/" + user.uid + "/booksNeeded");  
        ref.once("value")
          .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              var pendinExist = childSnapshot.child("pending").exists();
              console.log("pending exist: " + pendinExist)
              if (pendinExist) {
                pendingCounter++;
                console.log(childSnapshot.child("title").val())
                titles.push(childSnapshot.child("title").val())
                console.log("pending counter : " + pendingCounter)
              }
            });
          });
      }
    });
  }

  /*
  * Here we are displaying the notification according to the button 
  * that was clicked. We will display the number of books in pending state
  * and the titles of these books
  */
  createNotification = (type) => {
    return () => {
      switch (type) {
        case 'info':
          NotificationManager.info('You have ' + pendingCounter + ' pending trades for the following books: ' + titles, 'Info message');
          break;
        case 'success':
          NotificationManager.success('Success message', 'Title here');
          break;
        case 'warning':
          NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
          break;
        case 'error':
          NotificationManager.error('Error message', 'Click me!', 5000, () => {
            alert('callback');
          });
          break;
      }
    };
  };

  

  


  render() {
    return (
      <section class="wrapper">
        <div class="form-wrapper">
          <h1>Hello <span id="emailAddress"></span>!</h1>
          <div>
            <button onClick={() => window.location.href = '/search'}>Search</button>
            <button onClick={() => window.location.href = '/booksNeeded'}>Books Needed</button>
            <button onClick={() => window.location.href = '/booksAvailable'}>Books Available</button>
            <button onClick={() => window.location.href = '/match'}>Match Me!</button>
            <button onClick={() => window.location.href = '/trade'}>Current Trade</button>
            <button onClick={() => window.location.href = '/sale'}>Current Sale</button>
            <button onClick={() => window.location.href = '/donate'}>Current Donation</button>
            <button onClick={() => window.location.href = '/profile'}>Profile</button>
            <button onClick={() => app.auth().signOut()}>Sign out</button>
            <button className='btn btn-info' onClick={this.createNotification('info')}>Notification</button>
            <NotificationContainer/>
          </div>
        </div>
        
      </section>
    );
  }
}

export default Home;
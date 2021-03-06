import React, { Component } from 'react';
import './home.module.css';
import app from "./base.js";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

var pendingCounter = 0;

var trade_titles = [];
var sale_titles = [];
var donate_titles = [];

var av_trade_titles = [];
var av_sale_titles = [];
var av_donate_titles = [];
var titles2;

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
              var trade = childSnapshot.child("trade").exists();
              var sell = childSnapshot.child("sale").exists();
              var donate = childSnapshot.child("donate").exists();
              console.log("pending exist: " + pendinExist + "    trade: " + donate)
              if (pendinExist) {
                pendingCounter++;
                
                if (trade) {
                  console.log(childSnapshot.child("title").val())
                  trade_titles.push(childSnapshot.child("title").val())
                }

                if (sell) {
                  sale_titles.push(childSnapshot.child("title").val())
                }

                if (donate) {
                  donate_titles.push(childSnapshot.child("title").val())
                }
                console.log("pending counter : " + pendingCounter)
              }
            });
          });


          var ref2 = app.database().ref("users/" + user.uid + "/booksAvailable");  
          ref2.once("value")
          .then(function(snapshot2) {
            snapshot2.forEach(function(childSnapshot2) {
              var pendinExist = childSnapshot2.child("pending").val();
              var trade2 = childSnapshot2.child("trade").val();
              var sell2 = childSnapshot2.child("sale").val();
              var donate2 = childSnapshot2.child("donate").val();
              console.log("pending exist: " + pendinExist + "    donate: " + donate2)
              console.log("pending exist: " + pendinExist + "    trade : " + trade2)
              console.log("pending exist: " + pendinExist + "    sell : " + donate2)
              if (pendinExist) {
                pendingCounter++;
                
                if (trade2) {
                  pendingCounter--;
                  console.log(childSnapshot2.child("title").val())
                  av_trade_titles.push(childSnapshot2.child("title").val())
                }

                if (sell2) {
                  av_sale_titles.push(childSnapshot2.child("title").val())
                }

                if (donate2) {
                  av_donate_titles.push(childSnapshot2.child("title").val())
                }
                console.log("pending counter : " + pendingCounter)
              }
            });
          });
      }
    });

    //var titles = titles.join(",", "<br />");
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

        
          NotificationManager.info('You have ' + pendingCounter + ' pending books:', 'Info message', 6000);
          if (trade_titles.length !== 0) {
            NotificationManager.info('You will trade: ' + trade_titles, "", 6000);
          }

          if (av_trade_titles.length !== 0) {
            NotificationManager.info('Trade Available: ' + av_trade_titles, "", 6000);
          }

          if (sale_titles.length !== 0) {
            NotificationManager.info('You will sell: ' + sale_titles, "", 6000);
            
          }

          if (av_sale_titles.length !== 0) {
            NotificationManager.info('Sale Available: ' + av_sale_titles, "", 6000);
          }

          if (donate_titles.length !== 0) {
            NotificationManager.info('You will donate: ' + donate_titles , "", 6000);
          }

          if (av_donate_titles.length !== 0) {
            NotificationManager.info('Donation Available: ' + av_donate_titles, "", 6000);
          }
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
            <button className='btn btn-info' onClick={this.createNotification('info')}>Notification</button>
            <button onClick={() => app.auth().signOut()}>Sign out</button>
            <NotificationContainer/>
          </div>
        </div>
        
      </section>
    );
  }
}

export default Home;
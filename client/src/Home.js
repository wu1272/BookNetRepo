import React, { Component } from 'react';
import './home.module.css';
import app from "./base.js";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        document.getElementById("emailAddress").innerHTML = user.email;
      }
    });
  }


  render() {
    return (
      <section class="wrapper">
        <div class="form-wrapper">
          <h1>Hello <span id="emailAddress"></span>!</h1>
          <div>
            {this.state.users.map(user =>
              <li key={user.id}>{user.firstName} {user.lastName}</li>
            )}
          </div>
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
          </div>
        </div>
        
      </section>
    );
  }
}

export default Home;
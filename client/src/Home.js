import React, { Component } from 'react';
import './home.css';
import app from "./base.js";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    fetch('/api/users')
      .then(res => res.json())
      .then(users => this.setState({ users }, () => console.log('Users fetched...', users)));
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        document.getElementById("emailAddress").innerHTML = user.email;
      }
    });
  }


  render() {
    return (
      <section class="outer">
        <div class="inner">
          <h1>Hello <span id="emailAddress"></span>!</h1>
          <h2>Users</h2>
          <ul>
            {this.state.users.map(user =>
              <li key={user.id}>{user.firstName} {user.lastName}</li>
            )}
          </ul>
          <button class="btn" onClick={() => app.auth().signOut()}>Sign out</button>
          <button class="btn2" onClick={() => window.location.href = '/profile'}>Profile</button>
        </div>
      </section>
    );
  }
}

export default Home;
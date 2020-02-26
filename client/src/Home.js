import React, { Component } from 'react';
import './home.css';
import app from "./base.js";
import axios from "axios";

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


  deleteAccount() {
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        axios.post('/api/remove', {
          userid: user.uid
        })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          })
        // User is signed in.
        user.delete().then(function () {
          // User deleted.
          console.log("User was deleted succesfully")
        }).catch(function (error) {
          // An error happened.
          console.log("Error deleting user")
        });
      } else {
        console.log("Error: user does not exist")
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
          <button class="btn2" onClick={() => this.deleteAccount()}>Delete Account</button>
          <button class="btn3" onClick={() => window.location.href = '/profile'}>Profile</button>
        </div>
      </section>
    );
  }
}

export default Home;
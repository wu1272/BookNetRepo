import React, { Component } from 'react';
import './users.css';
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
      .then(users => this.setState({users}, () => console.log('Users fetched...', users)));
  }


  deleteAccount() {
    app.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log(user.email)
        console.log(user)

        if (user) {
          // User is signed in.
          user.delete().then(function() {
          // User deleted.
          console.log("User was deleted succesfully")
          }).catch(function(error) {
            // An error happened.
            console.log("Error deleting user")
          });
      } else {
        console.log("Error: user does not exist")
      }
    }
    });
  }


  render() {
    return (
      <div>
        <h2>Users</h2>
        <ul>
        {this.state.users.map(user => 
          <li key={user.id}>{user.firstName} {user.lastName}</li>
        )}
        </ul>
        <button onClick={() => app.auth().signOut()}>Sign out</button>
        <button onClick={() => this.deleteAccount()}>Delete Account</button>
      </div>
    );
  }
}

export default Home;
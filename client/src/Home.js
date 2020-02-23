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
      </div>
    );
  }
}

export default Home;
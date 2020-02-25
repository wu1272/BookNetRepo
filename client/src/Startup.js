import React, { Component } from 'react';

class Startup extends Component {
  render() {
    return (
      <div>
        <h2>Welcome to BookNet!</h2>
        <button onClick={() => window.location.href = '/login'}>Login</button>
        <button onClick={() => window.location.href = '/signup'}>Sign Up</button>
      </div>
    );
  }
}

export default Startup;
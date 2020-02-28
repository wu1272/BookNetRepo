import React, { Component } from 'react';
import "./startup.css"

class Startup extends Component {
  render() {
    return (
      <body>
        <section class="outer">
          <div class="inner">
            <h1>Welcome to BookNet!</h1>
            <button class="btn" onClick={() => window.location.href = '/login'}>Login</button>
            <button class="btn2" onClick={() => window.location.href = '/signup'}>Signup</button>
          </div>
        </section>
      </body>
    );
  }
}

export default Startup;
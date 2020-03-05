import React, { Component } from 'react';
import "./startup.module.css"

class Startup extends Component {
  render() {
    return (
      <body>
        <section className="wrapper">
          <div class="form-wrapper">
            <div>
              <h1>Welcome to BookNet!</h1>
              <button onClick={() => window.location.href = '/login'}>Login</button>
              <button onClick={() => window.location.href = '/signup'}>Signup</button>
            </div>
          </div>
        </section>
      </body>
    );
  }
}

export default Startup;
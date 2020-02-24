import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import app from "./base.js";
import { AuthContext } from "./Auth.js";

const Login = ({ history }) => {
  const handleLogin = useCallback(
    async event => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await app
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
        history.push("/home");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  function sendPassRecovery(e) {
    e.preventDefault()
    const auth = app.auth();
    const emailAddress = "user@example.com";

    auth.sendPasswordResetEmail(emailAddress).then(function() {
      // Email sent.
      alert("Email sent to ", emailAddress)
    }).catch(function(error) {
      // An error happened.
      alert(error)
    });
  }

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/home" />;
  }

  return (
    <div>
      <h1>Log in</h1>
      <form onSubmit={handleLogin}>
        <label>
          Email
          <input name="email" type="email" placeholder="Email" />
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="Password" />
        </label>
        <button type="submit">Log in</button>
        <button onClick={sendPassRecovery}>Forgot Password?</button>
      </form>
    </div>
  );
};

export default withRouter(Login);

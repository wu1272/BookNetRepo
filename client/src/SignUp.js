import React, { useCallback } from "react";
import { withRouter } from "react-router";
import app from "./base";
import "./signup.css"
import axios from "axios";

const SignUp = ({ history }) => {
  const handleSignUp = useCallback(async event => {
    event.preventDefault();
    const { firstname, lastname, email, password, password2 } = event.target.elements;
    if (password.value !== password2.value) {
      alert("Make sure you have typed the same password twice!");
    }
    else {
      try {
        await app
          .auth()
          .createUserWithEmailAndPassword(email.value, password.value);
        console.log(email.value);
        app.auth().onAuthStateChanged(function(user) {
          if (user) {
            sendUserID(firstname.value, lastname.value, user.uid);
          }
        });
        history.push("/home");
      } catch (error) {
        alert(error);
      }
    }
  }, [history]);

  return (
    <div className="wrapper">
      <div className="form-wrapper">
      <h1>Sign up</h1>
      <form onSubmit={handleSignUp}>
        <div className="firstName">
        <label htmlFor="firstName">
          <input type="text" id="firstname" name="firstname" required="required" pattern="[A-Za-z]{2,32}" placeholder="First Name"></input>
        </label>
        </div>
        <div className="lastName">
        <label htmlFor="lastName">
          <input type="text" id="lastname" name="lastname" required="required" pattern="[A-Za-z]{2,32}" placeholder="Last Name"></input>
        </label>
        </div>
        <div className="email">
        <p>Please enter valid purdue email address:</p>
        <label htmlFor="email">
          <input name="email" type="email" defaultValue="@purdue.edu" pattern=".*\@purdue.edu$" placeholder="Email" />
        </label>
        </div>
        <div className="password">
        <label htmlFor="password">
          <input name="password" type="password" placeholder="Password" />
        </label>
        </div>
        <div className="password">
        <label htmlFor="password">
          <input name="password2" type="password" required="required" placeholder="Verify Password" />
        </label>
        </div>
        <div className="createAccount">
        <button type="submit">Sign Up</button>
        </div>
      </form>
      </div>
    </div>
  );
  function sendUserID(firstname, lastname, userid) {
    app.auth().onAuthStateChanged(function (user) {
      // console.log(document.getElementById("firstname").value);
      // console.log(document.getElementById("lastname").value);
      // console.log(user.uid);
      var regexCheck = /^[a-zA-Z]+/;
      if ((!regexCheck.test(firstname)
        || (!regexCheck.test(lastname)))) {
        return;
      }
      axios.post('/api/name', {
        firstname: firstname,
        lastname: lastname,
        userid: userid
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        })
    });
  };
};

export default withRouter(SignUp);

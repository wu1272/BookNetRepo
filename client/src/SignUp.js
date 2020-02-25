import React, { useCallback } from "react";
import { withRouter } from "react-router";
import app from "./base";
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
    <div>
      <h1>Sign up</h1>
      <form onSubmit={handleSignUp}>
        <label>
          <input type="text" id="firstname" name="firstname" required="required" pattern="[A-Za-z]{2,32}" placeholder="First Name"></input>
        </label>
        <label>
          <input type="text" id="lastname" name="lastname" required="required" pattern="[A-Za-z]{2,32}" placeholder="Last Name"></input>
        </label>
        <label>
          <input name="email" type="email" placeholder="Email" />
        </label>
        <label>
          <input name="password" type="password" placeholder="Password" />
        </label>
        <label>
          <input name="password2" type="password" required="required" placeholder="Verify Password" />
        </label>
        <button type="submit">Sign Up</button>
      </form>
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

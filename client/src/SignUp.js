import React, { useCallback } from "react";
import { withRouter } from "react-router";
import app from "./base";
import "./signup.module.css"
import axios from "axios";

const SignUp = ({ history }) => {
  const handleSignUp = useCallback(async event => {
    event.preventDefault();
    const { firstname, lastname, email, password, password2 } = event.target.elements;
    if (password.value !== password2.value) {
      alert("Make sure you have typed the same password twice!");
    }
    else if (!(/@purdue\.edu$/.test(email.value))) {
      alert("Enter a valid @purdue.edu address!")
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
        <div>
    
          <input type="text" id="firstname" name="firstname" required="required" pattern="[A-Za-z]{2,32}" placeholder="First Name"></input>
          <input type="text" id="lastname" name="lastname" required="required" pattern="[A-Za-z]{2,32}" placeholder="Last Name"></input>
        
        </div>
        
        <div>

        <p>Please enter valid purdue email address:</p>
        
          <input name="email" type="email" defaultValue="@purdue.edu" placeholder="Email" />
          <br />
          <input name="password" type="password" placeholder="Password" />
          <input name="password2" type="password" required="required" placeholder="Verify Password" />
        
        </div>
        
        <div>
          <button type="submit">Sign Up</button>
        </div>
        <div>
          <button onClick={() => window.location.href = '/login'}>Login</button>
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

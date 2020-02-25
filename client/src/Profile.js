import React, { Component } from 'react';
import './users.css';
import app from "./base.js";
import axios from "axios";

const Profile = () => {
  return (
    <div>
      <h2>Profile</h2>
      <form>
        <label>
          First Name
                    <input type="text" id="firstname" name="firstname" required="required" pattern="[A-Za-z]{1,32}" placeholder="First Name"></input>
        </label>
        <label>
          Last Name
                    <input type="text" id="lastname" name="lastname" required="required" pattern="[A-Za-z]{1,32}" placeholder="Last Name"></input>
        </label>
        <input id="submit" type="submit" value="Submit" onClick={(e) => { sendUserID(e) }} />
      </form>
      <button onClick={() => window.location.href = '/home'}>Home</button>
    </div>
  );
  function sendUserID() {
    app.auth().onAuthStateChanged(function (user) {
      // console.log(document.getElementById("firstname").value);
      // console.log(document.getElementById("lastname").value);
      // console.log(user.uid);
      var regexCheck = /^[a-zA-Z]+/;
      if ((!regexCheck.test(document.getElementById("firstname").value)
        || (!regexCheck.test(document.getElementById("lastname").value)))) {
        return;
      }
      axios.post('/api/name', {
        firstname: document.getElementById("firstname").value,
        lastname: document.getElementById("lastname").value,
        userid: user.uid
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        })
    });
  };
}


// componentDidMount() {
//   document.getElementById("submit").onclick = this.sendUserID();
// }    

export default Profile;



{/* <form method="POST" action="/api/name" >
<label>
    First Name
    <input type="text" id="firstname" name="firstname" placeholder="First Name"></input>
</label>
<label>
    Last Name
    <input type="text" id="lastname" name="lastname" placeholder="Last Name"></input>
</label>
<input type="submit" value="Submit"></input>
</form> */}
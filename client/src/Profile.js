import React from 'react';
import app from "./base.js";
import axios from "axios";

const Profile = () => {

  app.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      document.getElementById("currentEmailLabel").innerHTML = "Email: " + user.email + ' <i class="fa fa-cog"></i>'
    } else {
      // No user is signed in.
      window.location.href = '/'
    }
  });
  
  function updateEmail() {
    var user = app.auth().onAuthStateChanged()
    var newEmail = ""

    user.updateEmail(newEmail).then(function() {
      // Update successful.
    }).catch(function(error) {
      // An error happened.
    });
  }

  return (
    <div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      <h2>Profile</h2>
      
      <label id="currentEmailLabel">Email: 
      <i class="fa fa-cog"></i>
      </label>

      <form>
        <h3>Change Name</h3>
        <label>
          <input type="text" id="firstname" name="firstname" required="required" pattern="[A-Za-z]{2,32}" placeholder="First Name"></input>
        </label>
        <label>
          <input type="text" id="lastname" name="lastname" required="required" pattern="[A-Za-z]{2,32}" placeholder="Last Name"></input>
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
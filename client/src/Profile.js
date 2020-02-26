import React, { useState } from 'react';
import app from "./base.js";
import axios from "axios";
import Modal from "react-modal"

// CSS style for modal popout 
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};


// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root')

const Profile = () => {

  // Code for modals //
  const [changeEmailModalIsOpen, setEmailModalIsOpen] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [confimPass, setConfirmPass] = useState('')

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function openEmailModal(e) {
    e.preventDefault()
    setEmailModalIsOpen(true)
  }

  function closeEmailModal() {
    setEmailModalIsOpen(false)
  }




  // Display email of user in profile
  app.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      // Display user email 
      setCurrentUserEmail(user.email)
      document.getElementById("currentEmailText").innerHTML = '<strong>Email: </strong>' + user.email

      //create gear button for opening modal 
      //<button onClick={openModal}><i class="fa fa-cog"></i></button>
      var editUserEmailButton = document.createElement('button')
      editUserEmailButton.innerHTML = '<i class="fa fa-cog"></i>'
      editUserEmailButton.style = 'margin: 5px'
      editUserEmailButton.onclick = openEmailModal
      document.getElementById("currentEmailText").appendChild(editUserEmailButton)
    
    } else {
      // No user is signed in.
      window.location.href = '/'
    }
  });
  

  //Call to firebase to update user email 
  function updateEmail() {
    app.auth().onAuthStateChanged(function (user) {
      //check if user is non null
      if(user) {


        app.auth().signInWithEmailAndPassword(currentUserEmail, confimPass)
            .then(function(userCredential) {
              userCredential.user.updateEmail(newUserEmail)
            })
      }else {
        alert("User Not Signed In")
      }
    })
  }

  return (
    <div>
      <Modal
          isOpen={changeEmailModalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeEmailModal}
          style={customStyles}
          contentLabel="Example Modal" >

          <h3>Update Email</h3>
          <p>Enter new email below</p>
          <input name="newUserEmail" type="email" placeholder="New Email" onChange={event => setNewUserEmail(event.target.value)} />
          <input name="confirmPass" type="password" placeholder="password" onChange={event => setConfirmPass(event.target.value)} />
          <button style={{marginLeft: '5px'}} onClick={updateEmail}>Update Email</button>

        </Modal>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      <h2>Profile</h2>
      
      
      <label id="currentEmailText"><strong>Email: </strong> <button onClick={openEmailModal}><i class="fa fa-cog"></i></button></label>
        
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



/* <form method="POST" action="/api/name" >
<label>
    First Name
    <input type="text" id="firstname" name="firstname" placeholder="First Name"></input>
</label>
<label>
    Last Name
    <input type="text" id="lastname" name="lastname" placeholder="Last Name"></input>
</label>
<input type="submit" value="Submit"></input>
</form> */
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

  // Code for modal //
  const [modalIsOpen, setIsOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('')

  function openModal(e) {
    e.preventDefault()
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal(){
    setIsOpen(false);
  }


  // Display email of user in profile
  app.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      // Display user email 
      document.getElementById("currentEmailText").innerHTML = '<strong>Email: </strong>' + user.email

      //create gear button for opening modal 
      //<button onClick={openModal}><i class="fa fa-cog"></i></button>
      var editUserEmailButton = document.createElement('button')
      editUserEmailButton.innerHTML = '<i class="fa fa-cog"></i>'
      editUserEmailButton.style = 'margin: 5px'
      editUserEmailButton.onclick = openModal
      document.getElementById("currentEmailText").appendChild(editUserEmailButton)
    
    } else {
      // No user is signed in.
      window.location.href = '/'
    }
  });
  

  //Call to firebase to update user email 
  function updateEmail() {
    var user = app.auth().onAuthStateChanged()
    var newEmail = ""

    user.updateEmail(newEmail).then(function() {
      // Update successful.
      closeModal()
    }).catch(function(error) {
      // An error happened.
      alert(error)
    });
  }

  return (
    <div>
      <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal" >

          <h3>Update Email</h3>
          <p>Enter a new email for us to attempt to update below</p>
          <input id="modalInput" name="newUserEmail" type="email" placeholder="New Email" onChange={event => setNewUserEmail(event.target.value)} />
          <button style={{marginLeft: '5px'}} onClick={updateEmail}>Update Email</button>

        </Modal>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      <h2>Profile</h2>
      
      
      <label id="currentEmailText"><strong>Email: </strong> <button onClick={openModal}><i class="fa fa-cog"></i></button></label>
        
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
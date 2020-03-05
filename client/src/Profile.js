import React, { useState } from 'react';
import app from "./base.js";
import axios from "axios";
import styles from "./profile.module.css"
import Modal from "react-modal"

// CSS style for modal popout 
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};


let defaultProfilePic = "https://cdn0.iconfinder.com/data/icons/iphone-black-people-svg-icons/40/agent_user_stock_spy_mail_help_hat_vehicle_vector_trustee-512.png"

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root')

const Profile = () => {

  // Code for modals //
  const [changeEmailModalIsOpen, setEmailModalIsOpen] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [confimPass, setConfirmPass] = useState('')
  const [userImage, setUserImage] = useState('')


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
  app.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      // Display user email 
      setCurrentUserEmail(user.email)
      setUserImage(user.photoURL)
      document.getElementById("currentEmailText").innerHTML = '<strong>Email: </strong>' + user.email
                                                       

      //create gear button for opening modal   
      var editUserEmailButton = document.createElement('button')
      editUserEmailButton.className = styles.gearButton
      editUserEmailButton.innerHTML = '<i class="fa fa-cog"></i>'
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
      if (/@purdue\.edu$/.test(newUserEmail)) {

        if (user) {
          app.auth().signInWithEmailAndPassword(currentUserEmail, confimPass)
            .then(function (userCredential) {
              userCredential.user.updateEmail(newUserEmail).then(function () {
                //Email updated 
                alert("Email address updated to " + newUserEmail)
                setCurrentUserEmail(newUserEmail)
              }).catch(function (error) {
                //Error updating email 
                alert("ERROR: Could not update user email")
              })
            }).catch(function (error) {
              alert("ERROR: Invalid Password")
            })
        } else {
          alert("ERROR: User Not Signed In")
        }
      }
      else {
        alert("Enter a valid @purdue.edu address!")
      }
    })
  }

  return (
    <div className="wrapper">
      <div className="form-wrapper">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>


      <Modal
          isOpen={changeEmailModalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeEmailModal}
          style={customStyles}
          contentLabel="Example Modal" >

          <h3>Update Email</h3>
          <p>Enter new email below</p>
          <input name="newUserEmail" type="email" defaultValue="@purdue.edu" placeholder="New Email" onChange={event => setNewUserEmail(event.target.value)} />
          <input name="confirmPass" type="password" placeholder="Password" onChange={event => setConfirmPass(event.target.value)} />
          <button style={{ marginLeft: '5px' }} onClick={(e) => { updateEmail(e) }}>Update Email</button>

        </Modal>

        <h1>Profile</h1>

        <div>
          <img src={userImage || defaultProfilePic} alt="Uploaded images" height="250" width="250" />
          <button className={styles.picButton} onClick={() => window.location.href = '/components/UploadImage'}>Upload Profile Image</button>
        </div>
  
        <div id="currentEmailText"><strong>Email: </strong> <button className={styles.gearButton} onClick={openEmailModal}><i class="fa fa-cog"></i></button></div>

        <form>
          <h3>Change Name</h3>
          <div>
            <input type="text" id="firstname" name="firstname" required="required" pattern="[A-Za-z]{2,32}" placeholder="First Name"></input>
            <input type="text" id="lastname" name="lastname" required="required" pattern="[A-Za-z]{2,32}" placeholder="Last Name"></input>
            <input id="submit" type="submit" value="Update Name!" onClick={(e) => { sendUserID(e) }} />
          </div>  
        </form>


        <form>
          <h3>Change Password</h3>
          <div>
              <input type="password" id="password" name="password" required="required" placeholder="Password"></input>
              <input type="password" id="password2" name="password1" required="required" placeholder="Verify Password"></input>
              <input id="submitPW" type="submit" value="Update Password!" onClick={(e) => { updatePW(e) }} />
          </div>
        </form>
        <div className={styles.deleteAccount}>
          <button onClick={(e) => { deleteAccount(e) }}>Delete Account</button>
        </div>
        <div>
          <button onClick={() => window.location.href = '/home'}>Home</button>
        </div>
      </div>
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

  function updatePW() {
    app.auth().onAuthStateChanged(function (user) {
      if (document.getElementById("password").value !== document.getElementById("password2").value) {
        alert("Error: passwords don't match!");
      }
      else {
          var psswd1 = document.getElementById("password").value;
    
          if (psswd1.length < 6) {
            alert("Please enter a valid password, 6 character or more!")
          }
          else {
            var newPassword = document.getElementById("password").value;
            user.updatePassword(newPassword).then(function () {
            // Update successful.
          
            }).catch(function (error) {
            // An error happened.
              alert("Please enter a valid password, 6 character or more!")
            });

            alert("Your password has been updated! Now you will be redirected to the login page")

          }
      }
      
    });
  };

  function deleteAccount() {
    if (!window.confirm("Are you sure you want to delete your account?")) {
      return;
    }
    else {
      app.auth().onAuthStateChanged(function (user) {
        if (user) {
          axios.post('/api/remove', {
            userid: user.uid
          })
            .then(function (response) {
              console.log(response);
            })
            .catch(function (error) {
              console.log(error);
            })
          // User is signed in.
          console.log(user.uid);
          user.delete().then(function () {
            // User deleted.
            console.log("User was deleted succesfully")
          }).catch(function (error) {
            // An error happened.
            console.log("Error deleting user")
          });
        } else {
          console.log("Error: user does not exist")
        }
      });
    }
  }
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
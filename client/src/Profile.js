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
  const [changeEmailModalIsOpen, setEmailModalIsOpen] = useState(false)
  const [uploadPhotoModalIsOpen, setUploadPhotoModalIsOpen] = useState(false)
  const [updateNameModalIsOpen, setUpdateNameModalIsOpen] = useState(false)
  const [passModalIsOpen, setPassModalIsOpen] = useState(false)
  const [currentUserEmail, setCurrentUserEmail] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [confimPass, setConfirmPass] = useState('')
  const [newFirstName, setNewFirstName] = useState('')
  const [newLastName, setNewLastName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmNewPass, setConfirmNewPass] = useState('')
 


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

  function openUploadModal(e) {
      e.preventDefault()
      setUploadPhotoModalIsOpen(true)
  }

  function closeUploadModal() {
    setUploadPhotoModalIsOpen(false)  
    //window.location.reload(true)
  }

  
  function updateImage() {
    //console.log("updating image")
    var image = document.getElementById("profileImage")
    image.src = userImage
    setProgressBar(0)
  }

  function openUpdateNameModal(e) {
    e.preventDefault()
    setUpdateNameModalIsOpen(true)
}

function closeUpdateNameModal() {
    setUpdateNameModalIsOpen(false)
}

function openPassModal(e) {
  e.preventDefault()
  setPassModalIsOpen(true)
}

function closePassModal() {
  setPassModalIsOpen(false)
}


  /* Upload Photo code */
  const [imageFile, setImageFile] = useState(null)
  const [progressBar, setProgressBar] = useState(0)
  const [userImage, setUserImage] = useState('')


  function handleFile(e) {
        if(e.target.files[0]){
            setImageFile(e.target.files[0])
        }
    }


  function handleUpload(e) {
        var storageref = app.storage()
        app.auth().onAuthStateChanged(function(user) {

            if(user) {
                const uploadTask = storageref.ref(user.email + `/Profile Picture/picture`).put(imageFile);

                uploadTask.on('state_changed', (snapshot) => {
                        //progress function ....
                        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                        setProgressBar(progress)
                    }, 
                    (error) => {
                        //error function ...
                        alert(error)
                    },
                    
                    () => {
                        storageref.ref(user.email + '/Profile Picture/').child('picture').getDownloadURL().then(url => {
                            user.updateProfile({photoURL: url})
                            setUserImage(url)
                            closeUploadModal()
                        })

                    });   
                    

            }
            
        })
    }


    /* DONE WITH PHOTO UPLOAD CODE */




  // Display information of user in profile
  app.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      // Display user email 
      setCurrentUserEmail(user.email)
      setUserImage(user.photoURL)

      //get first and last name
      var userId = user.uid
      app.database().ref('users/' + userId).once('value').then(function (snapshot) {
        //console.log(snapshot.val())
        let uFirstName = (snapshot.val() && snapshot.val().firstname) || 'NoFirstNameError'
        let uLastName = (snapshot.val() && snapshot.val().lastname) || 'NoLastNameError'
      
        setFirstName(uFirstName)
        //console.log(uLastName)
        setLastName(uLastName)
        
      }) 

      
      document.getElementById("currentEmailText").innerHTML = '<strong>Email: </strong>' + currentUserEmail
      document.getElementById("currentNameText").innerHTML = '<strong>Name: </strong>' + firstName + ' ' + lastName
                                                       

      //create gear button for opening modal   
      var editUserEmailButton = document.createElement('button')
      editUserEmailButton.className = styles.gearButton
      editUserEmailButton.innerHTML = '<i class="fa fa-cog"></i>'
      editUserEmailButton.onclick = openEmailModal
      document.getElementById("currentEmailText").appendChild(editUserEmailButton)

      var editNameButton = document.createElement('button')
      editNameButton.className = styles.gearButton
      editNameButton.innerHTML = '<i class="fa fa-cog"></i>'
      editNameButton.onclick = openUpdateNameModal
      document.getElementById("currentNameText").appendChild(editNameButton)
      
      
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
    <div className={styles.wrapper}>
      <div className="form-wrapper">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>

      <Modal 
          contentLabel="Edit email modal"
          isOpen={changeEmailModalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeEmailModal}
          style={customStyles}
          >

          <h3>Update Email</h3>
          <p>Enter new email below</p>
          <input className="modalInput" name="newUserEmail" type="email" defaultValue="@purdue.edu" placeholder="New Email" onChange={event => setNewUserEmail(event.target.value)} />
          <br/><input className="modalInput" name="confirmPass" type="password" placeholder="Password" onChange={event => setConfirmPass(event.target.value)} />
          <br/><button className="modalButton" onClick={(e) => { updateEmail(e) }}>Update Email</button>

        </Modal>

        <Modal 
          contentLabel="Upload profile image"
          isOpen={uploadPhotoModalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeUploadModal}
          style={customStyles}
          >

          <h1> Profile Picture Update </h1>
          <br/>
          <input className="modalInput" type="file" onChange={e => {handleFile(e)}}/>
          <br/>
          <progress value={progressBar} max="100"/>
          <br/>
          <button className="modalButton" onClick={e => {handleUpload(e)}}>Upload</button>    
          
        </Modal>

        <Modal 
          contentLabel="Upload user name"
          isOpen={updateNameModalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeUpdateNameModal}
          style={customStyles}
          >

          <div>
            <input className="modalInput" type="text" id="firstname" name="firstname" required="required" pattern="[A-Za-z]{2,32}" placeholder="First Name" onChange={event => setNewFirstName(event.target.value)}></input>
            <br/><input className="modalInput" type="text" id="lastname" name="lastname" required="required" pattern="[A-Za-z]{2,32}" placeholder="Last Name" onChange={event => setNewLastName(event.target.value)}></input>
            <br/><button className="modalButton" onClick={(e) => { sendUserID(e) }}>Update Name</button>
          </div>    
          
        </Modal>


        <Modal 
          contentLabel="Update User Password"
          isOpen={passModalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closePassModal}
          style={customStyles}
          >

          <h1> Change Password </h1>
          <br/>
          <input className="modalInput" type="password"  name="password" required="required" placeholder="Current Password" onChange={event => setConfirmPass(event.target.value)}></input>
          <br/><input className="modalInput" type="password"  name="password" required="required" placeholder="New Password" onChange={event => setNewPass(event.target.value)}></input>
          <br/><input className="modalInput" type="password"  name="password1" required="required" placeholder="Re-Enter New Password" onChange={event => setConfirmNewPass(event.target.value)}></input>
          <br/><button className="modalButton" id="submitPW" onClick={(e) => { updatePW(e) }}>Update Password</button>  
          
        </Modal>



        <div>
        <h1>Profile</h1>
        </div>
        
        <div>
          <figure>
            <img id="profileImage" src={userImage || defaultProfilePic} alt="Uploaded images" width="250vw"  />
          </figure>
          <button className={styles.picButton} onClick={openUploadModal}>Upload Profile Image</button>
        </div>

        <div id="currentNameText"><strong>Name: </strong> <button className={styles.gearButton} onClick={openUpdateNameModal}><i class="fa fa-cog"></i></button></div>

        <div id="currentEmailText"><strong>Email: </strong> <button className={styles.gearButton} onClick={openEmailModal}><i class="fa fa-cog"></i></button></div>

        <div><button onClick={openPassModal}>Change password</button></div>

        <div className={styles.deleteAccount}>
          <button onClick={(e) => { deleteAccount(e) }}>Delete Account</button>
        </div>
        <div className={styles.deleteBooksNeeded}>
          <button onClick={(e) => { deleteBooksNeeded(e) }}>Delete Book Needed</button>
        </div>
        <div className={styles.deleteBooksAvailable}>
          <button onClick={(e) => { deleteBooksAvailable(e) }}>Delete Book Available</button>
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
      if ((!regexCheck.test(newFirstName)
        || (!regexCheck.test(newLastName)))) {
        return;
      }

      app.database().ref('users/' + user.uid + '/').set({
        firstname: newFirstName,
        lastname: newLastName
      }).then(function() {
        alert("Username updated to: " + newFirstName + " " + newLastName)
        closeUpdateNameModal()
      }).catch(function(error) {
        alert(error)
        closeUpdateNameModal()
      })


      /*
      axios.post('/api/name', {
        firstname: newFirstName,
        lastname: newLastName,
        userid: user.uid
      })
        .then(function (response) {
          closeUpdateNameModal()
          alert("Username updated to: " + newFirstName + " " + newLastName)
         
        })
        .catch(function (error) {
          console.log(error);
        })

        */

    });


  };

  function updatePW() {
    app.auth().onAuthStateChanged(function (user) {
      if (newPass !== confirmNewPass) {
        alert("Error: passwords don't match!");
      }
      else {

          if (newPass.length < 6) {
            alert("Please enter a valid password, 6 character or more!")
          }
          else {

            app.auth().signInWithEmailAndPassword(currentUserEmail, confimPass)
            .then(function (userCredential) {
              userCredential.user.updatePassword(newPass).then(function () {
                alert("Password updated succesfully!")
                closePassModal()
              }).catch(function (error) {
                alert("Error updating password\nNew password may be same as before")
              })
            })
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


function deleteBooksNeeded() {
  if (!window.confirm("Are you sure you want to delete book?")) {
    return;
  }
  else {
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        axios.post('/api/bookNeededRemove', {
          userid: user.uid
        })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          })
        // User is signed in.
      } else {
        console.log("Error: book does not exist")
      }
    });
  }
}


function deleteBooksAvailable() {
  if (!window.confirm("Are you sure you want to delete book?")) {
    return;
  }
  else {
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        axios.post('/api/bookAvailableRemove', {
          userid: user.uid
        })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          })
        // User is signed in.
      } else {
        console.log("Error: book does not exist")
      }
    });
  }
}
  

export default Profile;

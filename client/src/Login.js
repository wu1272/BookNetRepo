import React, { useCallback, useContext, useState } from "react";
import { withRouter, Redirect } from "react-router";
import app from "./base.js";
import Modal from 'react-modal'
import { AuthContext } from "./Auth.js";

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

  // Code for modal //
  const [modalIsOpen, setIsOpen] = useState(false);

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
      <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        ></Modal>
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
        <button onClick={openModal}>Forgot Password?</button>
      </form>
    </div>
  );
};

export default withRouter(Login);

import React, { useCallback, useContext, useState } from "react";
import { withRouter, Redirect } from "react-router";
import app from "./base.js";
import Modal from "react-modal"
import styles from "./login.module.css"
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
  const [emailRecov, setEmailRecov] = useState('')

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
    const emailAddress = emailRecov

    auth.sendPasswordResetEmail(emailAddress).then(function() {
      // Email sent.
      setIsOpen(false)
      alert("Password Reset Email Sent.")
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
    <div className="wrapper">
      <div className="form-wrapper">
      <h1>Log in</h1>
      <Modal 
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h1>Reset Password</h1>
          <p>Don't worry! You may have forgotten your password, but we can help you out.<br/>Enter your email below and we'll email you a link to reset your password.</p>
          <input className="modalInput" name="emailRecovery" type="email" placeholder="Email" onChange={event => setEmailRecov(event.target.value)} />
          <br/><button className="modalButton" onClick={sendPassRecovery}>Send Email</button>

      </Modal>
      <form onSubmit={handleLogin}>
        <div>
          <input name="email" type="email" placeholder="Email" />
          <input name="password" type="password" placeholder="Password" />

        </div>
    
        <div>
          <button type="submit">Log in</button>
          <button onClick={openModal}>Forgot Password?</button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default withRouter(Login);




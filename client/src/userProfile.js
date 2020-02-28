import React, { Component } from 'react';
import './users.css';
import app from "./base.js";

class userProfile extends component {
    constructor() {
        super();
        this.state = {
          photoURL: ""
        };
    }

updateUserPic() {
    app.auth().onAuthStateChanged(function(user) {
        if (user) {
            user.updateProfile({
                displayName: "Jane Q. User",
                photoURL: "https://example.com/jane-q-user/profile.jpg"
              }).then(function() {
                // Update successful.
              }).catch(function(error) {
                // An error happened.
              });
        } else {
          // No user is signed in.
        }
      });
}


}
import React, { Component } from 'react';
import './users.css';
import app from "./base.js";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      email: '',
      url: '',
      image: null,
      load: false
      

      // ref: app.storage().ref('').getDownloadURL(),
      // url = await app.getDownloadUrl()
    };

    this.handleUpload = this.handleUpload.bind(this);
    
    //this.getImage('profilePic')
  }

  
  componentDidMount() {
    fetch('/api/users')
      .then(res => res.json())
      .then(users => this.setState({users}, () => console.log('Users fetched...', users)));
  }

  handleUpload = () => {  
    console.log("hello")    
    //var user = {};
    //const { image } = this.state;
    var storageref = app.storage();
        const temp = this;
            app.auth().onAuthStateChanged(function(user) {
                if (user) {
                    console.log(user.email)
                    temp.setState({email: user.email})
                    console.log(user)
                    if (user) {
                        user = user.email;
                        //this.name = user.email;
                    }
                }
              });

              
              //const uploadTask = storageref.ref(this.state.email + `/Profile Picture/picture`).put(image);
              const uploadTask = storageref.ref(this.state.email + `/Profile Picture/picture`)
                storageref.ref(this.state.email + `/Profile Picture/`).child('picture').getDownloadURL().then((url) => {
                  // this.state[image] = url
                  // this.setState(this.state)
                  
                  this.setState({url});
                  console.log(url);
                })
              
            }

  

  deleteAccount() {
    app.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log(user.email)
        console.log(user)

        if (user) {
          // User is signed in.
          user.delete().then(function() {
          // User deleted.
          console.log("User was deleted succesfully")
          }).catch(function(error) {
            // An error happened.
            console.log("Error deleting user")
          });
      } else {
        console.log("Error: user does not exist")
      }
    }
    });
  }

  

  
  


  render() {
    if (!this.state.load) {
      console.log(this.state.load)
        this.handleUpload();
        this.setState({
         load: true
        });
    }
    
    return (
      <div>
        <h2>Users</h2>
        <ul>
        {this.state.users.map(user => 
          <li key={user.id}>{user.firstName} {user.lastName}</li>
        )}
        </ul>
        <img src={ this.state.url } alt="ProfilePic" height="250" width="250" />
        {/* <img src={this.state.url} alt="Uploaded images" height="250" width="250"/> */}
        {/*<img src={this.state.url || 'https://upload.wikimedia.org/wikipedia/commons/c/c3/NGC_4414_%28NASA-med%29.jpg'} alt="Uploaded images" height="250" width="250"/>*/}
        
        <button onClick={() => app.auth().signOut()}>Sign out</button>
        <button onClick={() => this.deleteAccount()}>Delete Account</button>
        <button onClick={() => window.location.href='/components/ImageUpload'}>Upload Profile Pic</button>
      </div>
    );
  }
}

export default Home;
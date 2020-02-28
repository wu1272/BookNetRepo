import React, { Component } from 'react';
//import React, { useCallback, useContext, useState } from "react";
//import {storage} from '../firebase';
//import { storage } from '../base'
//import { database } from '../base'
import bookshelf from './bookshelf.jpg';
import './book.css';
//import './Home.js';
import app from "../base.js";
import { AuthContext } from '../Auth';
//import App from "..App.js";
//import firebase from 'firebase/app';
 


//Sources used in creating the ImageUpload feature for BookNet
//https://www.youtube.com/watch?v=YR4roPyfDQU

//const { currentUser } = useContext(AuthContext);
//Firebase user = FirebaseAuth.getInstance().getCurrentUser();
//int v = 1;
// FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
class ImageUpload  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            url: '',
            progress: 0,
            email: ''
         }
         
         
        this.handleChange = this.handleChange.bind(this);
         //this.handleUpload = this.handleUpload.bind(this);
    }

    

   
    handleChange = e =>  {
        if(e.target.files[0]) {
            const image = e.target.files[0];
            this.setState(() => ({ image }));
        }
    };

    
    // uploadPicture() {
    //     app.auth().onAuthStateChanged(function(user) {
    //         if (user) {
    //             console.log(user.email)
    //             console.log(user)
    //             if (user) {
    //                 //currentUser=user.email
    //                 this.name = user.email;
    //             }
    //         }
    //       });
    // }
    
    
    handleUpload = (e) => {      
        var user = {};
        const { image } = this.state;
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
        

                  //const email = this.state.email

               
                const uploadTask = storageref.ref(this.state.email + `/Profile Picture/picture`).put(image);
                //const uploadTask = storage.ref(`jim@gm}ail.com/${image.name}`).put(image);
                uploadTask.on('state_changed', (snapshot) => {
                //progress function ....
                     const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                     console.log('Upload is ' + progress + '%done');
                      this.setState({progress});
                }, 
                (error) => {
                    //error function ...
                    console.log(error);
                },
                 
                () => {
                    storageref.ref(this.state.email + '/Profile Picture/').child('picture').getDownloadURL().then(url => {
                        console.log(url);
                        this.setState({url});
                    })

                });           
    }

    render() {
        
        const style = {
            // height: '100vh',
            // display: 'flex',
            // flexDirection: 'column',
            // alignItems: 'center',
            // justifyContent: 'center',
            border: {
                borderRadius: 50
            },
            backgroundStyle: {
                
            }
            
        };
        
        var letterStyle = {
            backgroundImage: `url(${bookshelf})`,
            padding: 10,
            margin: 10,
        
            //backgroundColor: "grey",
            color: "#B1222D",
            display: "inline-black",
            fontFamily: "monospace",
            fontSize: "26px",
            textAlign: "center"
        }
        return ( 
            <div style={letterStyle}>
                
            <h1> Profile Picture Update </h1>
            <progress value={this.state.progress} max="100"/>
            <br/>
            
            <input type="file" onChange={this.handleChange}/>
            <button onClick={(e)=>this.handleUpload(e)}>Upload</button>    
            <br/>
            <h1>

            </h1>
            <img style={style.border} src={this.state.url || 'https://upload.wikimedia.org/wikipedia/commons/c/c3/NGC_4414_%28NASA-med%29.jpg'} alt="Uploaded images" height="250" width="250"/>
            <h6> Choose file and click Upload button to change Profile picture </h6>
            </div>
            
        )
    }
}

export default ImageUpload;
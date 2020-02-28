import React, { useState } from "react";
import bookshelf from './bookshelf.jpg';
import './book.css';
import app from "../base.js";

const UploadImage = () => {


    const [imageFile, setImageFile] = useState(null)
    const [progressBar, setProgressBar] = useState(0)
    const [imageURL, setImageURL] = useState('')



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
                        console.log(error)
                    },
                    
                    () => {
                        storageref.ref(user.email + '/Profile Picture/').child('picture').getDownloadURL().then(url => {
                            console.log(url)
                            setImageURL(url)
                        })

                    });   
                    

            }
            
        })
    }

        
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
        <progress value={progressBar} max="100"/>
        <br/>
        
        <input type="file" onChange={e => {handleFile(e)}}/>
        <button onClick={e => {handleUpload(e)}}>Upload</button>    
        <br/>
        <h1>

        </h1>
        <img style={style.border} src={{imageURL} || 'https://upload.wikimedia.org/wikipedia/commons/c/c3/NGC_4414_%28NASA-med%29.jpg'} alt="Uploaded images" height="250" width="250"/>
        <h6> Choose file and click Upload button to change Profile picture </h6>
        </div>
        
    )
    


}

export default UploadImage
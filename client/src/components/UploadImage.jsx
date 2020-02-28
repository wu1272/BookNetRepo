import React, { Component, useState } from "react";
import bookshelf from './bookshelf.jpg';
import './book.css';
import app from "../base.js";

const UploadImage = () => {


    const [imageFile, setImageFile] = useState(null);

    function handleFile(e) {
        if(e.target.files[0]){
            setImageFile(e.target.files[0])
        }
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
        <progress value="50" max="100"/>
        <br/>
        
        <input type="file" onChange={e => {handleFile(e)}}/>
        <button>Upload</button>    
        <br/>
        <h1>

        </h1>
        <img style={style.border} src={'https://upload.wikimedia.org/wikipedia/commons/c/c3/NGC_4414_%28NASA-med%29.jpg'} alt="Uploaded images" height="250" width="250"/>
        <h6> Choose file and click Upload button to change Profile picture </h6>
        </div>
        
    )
    


}

export default UploadImage
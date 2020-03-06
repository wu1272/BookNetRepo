import React, { Component } from 'react';
import app from "./base.js";
import axios from "axios";

class Search extends Component {
    componentDidMount(){
        setBooksNeeded("998", "Book of Life", "John Deere");
    }

    render () {
        return (
            <div>
                <h1>added book of life</h1>
            </div>
        );
    }
}


function setBooksNeeded(ISBN, title, author) {
    app.auth().onAuthStateChanged(function (user) {
        if (user) {
            axios.post('/api/setBooksNeeded', {
                userid: user.uid,
                ISBN: ISBN,
                title: title,
                author: author
            })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
    });
}
export default Search
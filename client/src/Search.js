import React, { Component, useState } from 'react';
import app from "./base.js";
import axios from "axios";
import styles from "./search.module.css"


function Search() {
        const[book, setBook] = useState("");
        const[result, setResult] = useState([]);
        const[apiKey, setApiKey] = useState("AIzaSyDRic7TFZjyUeYGPtUo0UVj1Wzx1oXhAsc");
        function handleChange(event) {
            const book = event.target.value;
            setBook(book);
        }
        function handleSubmit(event){
            event.preventDefault();
            axios.get("https://www.googleapis.com/books/v1/volumes?q="+book+"&key=" + apiKey+"&maxResults=40")
            .then(data=> {
                console.log(data);
                setResult(data.data.items);
            })
        }
        setBooksNeeded("998", "Book of Life", "John Deere");
        setBooksAvailable("2000", "Notecards", "Hank Williams");
        return (
            <body className="landing">
            <div>
                <h1>Book Search App</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input onChange={handleChange} type="text" placeholder="Search for Books" autoComplete="off"/>
                    </div>
                    <button className={styles.tester} type="submit">Search</button>
                </form>
                {result.map(book => (
                    <a href={book.volumeInfo.previewLink}>
                    <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.title}/>
                    </a>
                ))}
            </div>
            </body>
        );
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

function setBooksAvailable(ISBN, title, author) {
    app.auth().onAuthStateChanged(function (user) {
        if (user) {
            axios.post('/api/setBooksAvailable', {
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
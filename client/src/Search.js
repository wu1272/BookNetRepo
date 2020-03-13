import React, { useState } from 'react';
import app from "./base.js";
import axios from "axios";
import styles from "./search.module.css"

let defaultBookPic = "https://static.vecteezy.com/system/resources/thumbnails/000/365/820/small/Basic_Elements__2818_29.jpg"



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
            axios.get("https://www.googleapis.com/books/v1/volumes?q="+book+"&key="+apiKey+"&maxResults=40")
            .then(data=> {
                console.log(data);
                setResult(data.data.items);
            })
        }
        //setBooksNeeded("998", "Book of Life", "John Deere");
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
                <button onClick={() => window.location.href = '/home'}>Home</button>
                {result.map(book => (
                    <button>
                        <button onClick={ (e) => { setBooksNeeded(e, book.id, book.volumeInfo.title, book.volumeInfo.authors)}}> Book Needed</button>
                    
                        <img src={((book.volumeInfo.imageLinks) ? book.volumeInfo.imageLinks.thumbnail : defaultBookPic)} />
                        
                        <input type="checkbox" class="hidden" id="trade"/>
                        <label>For Trade</label>

                        <input type="checkbox" class="hidden" id="donation"/>
                        <label>For Donation</label>

                        <input type="checkbox" class="hidden" id="sale"/>
                        <label>For Sale</label>

                        <button onClick={ (e) => { setBooksAvailable(e, book.id, book.volumeInfo.title, book.volumeInfo.authors)}}> Book Available</button>
                    </button>
                   
                ))}
            </div>
            </body>
        );
    }


    function setBooksNeeded(e, book_id, book_title, book_authors) {   
        app.auth().onAuthStateChanged(function (user) {
            if (user) {
                if (book_authors === undefined) {
                    book_authors = "";
                }
                axios.post('/api/setBooksNeeded', {
                    userid: user.uid,
                    bookID: book_id,
                    title: book_title,
                    author: book_authors,
                    event: e
                })
                    .then(function (response) {
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                if(!alert('Added ' + book_title + " to your list of books needed!")) {
                    window.location.reload();
                }
            }
        });
    }
function setBooksAvailable(e, book_id, book_title, book_authors) {
    app.auth().onAuthStateChanged(function (user) {
        if (user) {
            var sale = document.getElementById("sale").checked
            var donate = document.getElementById("donation").checked
            var trade = document.getElementById("trade").checked
            

            //only send to backend if exactly 1 box is checked
            var count = 0;
            
            if (sale) {
                count++;
            }
            if (donate) {
                count++;
            }
            if (trade) {
                count++;
            }

            //user must select exactly 1 category
            if (count === 0) {
                alert("Please select a category: trade/sale/donation")
            }
            else if (count > 1) {
                alert("Please select exactly 1 category!")
            }
            else {
                if (book_authors === undefined) {
                    book_authors = null;
                }
                axios.post('/api/setBooksAvailable', {
                    userid: user.uid,
                        bookID: book_id,
                        title: book_title,
                        author: book_authors,
                        sale: sale,
                        donate: donate,
                        trade: trade,
                        event: e
                })
                    .then(function (response) {
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                //alert user to book added and reload page to reset all variables
                if(!alert('Added ' + book_title + " to your list of books available!")) {
                    window.location.reload();
                }
            }
        }
    });
}

export default Search
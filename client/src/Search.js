import React, { useState } from 'react';
import app from "./base.js";
import axios from "axios";
import styles from "./search.module.css"
import Modal from "react-modal"


let defaultBookPic = "https://static.vecteezy.com/system/resources/thumbnails/000/365/820/small/Basic_Elements__2818_29.jpg"

//Method of availability (Trade, Sale, Donate)
let availMethod = ""


/*
 * functions to handle change in the checkbox
 */
// function handleTradeChange(e) {
//     const trade = e.target.checked
//     for_trade = trade;
//     console.log("for_trade" + for_trade)
// }

// function handleDonationChange(e) {
//     const donate = e.target.checked
//     for_donation = donate;
//     console.log("for_donation:" + for_donation )
// }

// function handleSellChange(e) {
//     const sell = e.target.checked
//     for_sale = sell;
//     console.log("for_sale:" + for_sale )

// }

// CSS style for modal popout 
const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    }
  };


function Search() {
        const[book, setBook] = useState("");
        const[result, setResult] = useState([]);
        const apiKey = "AIzaSyDRic7TFZjyUeYGPtUo0UVj1Wzx1oXhAsc";


        //state for modal 
        const [isModalOpen, setIsModalOpen] = useState(false)
        const [currBook, setCurrBook] = useState({
            bookID: "",
            name: "",
            author: [],
            img: ""

        })
        

        //Modal functions
        function afterOpenModal() {
            // references are now sync'd and can be accessed.
            console.log(currBook)
        }
        

        function openModal(book) {

            setCurrBook(prev => ({...prev, 
                            bookID: book.id, 
                            name: book.volumeInfo.title, 
                            author: book.volumeInfo.authors, 
                            img: ((book.volumeInfo.imageLinks) ? book.volumeInfo.imageLinks.thumbnail : defaultBookPic)}))

        
            setIsModalOpen(true)
            
        }
        
        function closeModal() {
            setIsModalOpen(false)
        }

        function handleAvailableBook(method) {
            availMethod = method
            setBooksAvailable(null, currBook.bookID, currBook.name, currBook.author)
        }

        //End of Modal functions

        function handleChange(event) {
            const book = event.target.value;
            setBook(book);
        }
        function handleSubmit(event){
            event.preventDefault();
            var regexCheck = /[0-9a-zA-z]+/;
            if (!regexCheck.test(book)) {
                alert("Please enter book Title, Author, or ISBN!");
            }
            else {
                axios.get("https://www.googleapis.com/books/v1/volumes?q="+book+"&key="+apiKey+"&maxResults=40")
                .then(data=> {
                    console.log(data);
                    console.log(data.data.totalItems)
                    if (data.data.totalItems === 0) {
                        if (!alert("No results found!")) {
                            window.location.reload();
                            return;
                        }
                    }
                    setResult(data.data.items);
                })
            }
        }



        return (
        

            
            <div className={styles.moddedWrap}>
            <div className={styles.moddedFormWrap}>

                <Modal 
                    id="availBookModal"
                    contentLabel="Select book option"
                    isOpen={isModalOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                >
                    <div className={styles.modalContainer}>
                        <h3 className={styles.modalHeader} >{currBook.name}</h3>
                        <img className={styles.bookImg} src={currBook.img}></img>
                        <button className={styles.tradeIt}  onClick={(e) => {handleAvailableBook("T")}}>Trade It</button>
                        <button className={styles.sellIt}   onClick={(e) => {handleAvailableBook("S")}}>Sell It</button>
                        <button className={styles.donateIt} onClick={(e) => {handleAvailableBook("D")}}>Donate It</button>
                    </div>
                    


                </Modal>

                
                <form onSubmit={handleSubmit}>
                    <div>
                        <h1>Search for Books</h1>
                        <input onChange={handleChange} type="text" placeholder="Title, Author, or ISBN..." autoComplete="off"/>
                        <br/>
                        <button className={styles.headerButtons} type="submit">Search</button>
                    </div>
                </form>
                <div>
                <button className={styles.headerButtons} onClick={() => window.location.href = '/home'}>Home</button>
                </div>
                <br/>
                    {result.map(book => (
                        <div className={styles.container}>

                            <img className={styles.bookImg} src={((book.volumeInfo.imageLinks) ? book.volumeInfo.imageLinks.thumbnail : defaultBookPic)} />
                            
                            <br/>

                            <button className={styles.bookNeed} onClick={ (e) => { setBooksNeeded(e, book.id, book.volumeInfo.title, book.volumeInfo.authors)}}> Book Needed</button>
                            
                            <button className={styles.bookHave} onClick={(e) => {openModal(book)}}> Book Available</button>
                        </div>
                    
                    ))}
            </div>
            </div>
            
        );
    }


    //<button className={styles.bookHave} onClick={ (e) => { setBooksAvailable(e, book.id, book.volumeInfo.title, book.volumeInfo.authors)}}> Book Available</button>


    // <input type="checkbox" class="hidden" id="trade"   onChange={handleTradeChange}/>
    //                     <label>For Trade</label>

    //                     <input type="checkbox" class="hidden" id="donation" onChange={handleDonationChange}/>
    //                     <label>For Donation</label>

    //                     <input type="checkbox" class="hidden" id="sale"  onChange={handleSellChange}/>
    //                     <label>For Sale</label>

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

            var trade = false
            var sale = false
            var donate = false

            if(availMethod === "T") {
                trade = true
            }
            else if(availMethod === "S") {
                sale = true
            }
            else if(availMethod === "D") {
                donate = true
            }

    
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
    });
}

export default Search
import React, { useState } from 'react';
import app from "./base.js";
import axios from "axios";
import styles from "./search.module.css"
import Modal from "react-modal"


let defaultBookPic = "https://static.vecteezy.com/system/resources/thumbnails/000/365/820/small/Basic_Elements__2818_29.jpg"


//global variables to keep track of state change
var for_trade = false;
var for_donation = false;
var for_sale = false;


/*
 * functions to handle change in the checkbox
 */
function handleTradeChange(e) {
    const trade = e.target.checked
    for_trade = trade;
    console.log("for_trade" + for_trade)
}

function handleDonationChange(e) {
    const donate = e.target.checked
    for_donation = donate;
    console.log("for_donation:" + for_donation )
}

function handleSellChange(e) {
    const sell = e.target.checked
    for_sale = sell;
    console.log("for_sale:" + for_sale )

}

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
            <body className="landing">

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
                    <button className={styles.tradeIt}>Trade It</button>
                    <button className={styles.sellIt}>Sell It</button>
                    <button className={styles.donateIt}>Donate It</button>
                </div>
                


            </Modal>

            <div>
                <h1>Book Search App</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input onChange={handleChange} type="text" placeholder="Search for Books" autoComplete="off"/>
                        <button type="submit">Search</button>
                    </div>
                </form>
                <button className={styles.tester} onClick={() => window.location.href = '/home'}>Home</button>
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
            </body>
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
            // var sale = document.getElementById("sale").checked
            // var donate = document.getElementById("donation").checked
            // var trade = document.getElementById("trade").checked

 
            var sale = for_sale;
            var donate = for_donation;
            var trade = for_trade;
            

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

                    for_sale = false;
                    for_trade = false;
                    for_donation = false;
                //alert user to book added and reload page to reset all variables
                if(!alert('Added ' + book_title + " to your list of books available!")) {
                    window.location.reload();
                }
            }
        }
    });
}

export default Search
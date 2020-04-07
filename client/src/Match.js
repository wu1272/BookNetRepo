import React, { Component, useState } from 'react';
import app from "./base.js";
import styles from "./matches.module.css"
import axios from "axios";
import Modal from "react-modal"


var tradeMatches = []
var saleMatches = []
var donateMatches = []


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






class Match extends Component {



    constructor(props) {
        super(props);

        this.state = {
            isModalOpen: false,
            modalContent: []
        }

        this.listingCallBack = this.listingCallBack.bind(this)
        this.createBookListing = this.createBookListing.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.afterOpenModal = this.afterOpenModal.bind(this)
    }

    

    componentDidMount() {

        app.auth().onAuthStateChanged((user) => {
            if (user) {
                var bookIDs = [];
                var bookAvailableIDs = [];
                var allBookIDsAvailable = [];
                var allBookIDsNeeded = [];
                var allUserIDsAvailable = [];
                var availableInYourDir = [];  //actual book objects
                var allUserNamesAvailable = [];
                getBooksNeededIDs(bookIDs, user.uid, () => {
                    //console.log(bookIDs);
                    getBooksAvailableIDs(bookAvailableIDs, user.uid,()  =>{
                        
                    
                    getEverySingleDamnBookNeeded(allBookIDsNeeded,()  =>{
                        
                    
                    getEverySingleDamnBookAvailable(allUserNamesAvailable, allUserIDsAvailable, allBookIDsAvailable, () => {

                        preventPendingTrades(availableInYourDir, user.uid,()  =>{
                        //console.log(availableInYourDir)
                        //console.log(allBookIDsAvailable);
                        //console.log(bookIDs);
                        //console.log(allBookIDsNeeded.length);
                        for (var i = 0; i < allBookIDsAvailable.length; i++) {
                            for (var j = 0; j < bookIDs.length; j++) {
                               
                                
                                //Null check
                                if(allBookIDsAvailable[i] === null || bookIDs[j] === null) {
                                    break
                                }

                                //get book they have that user needs
                                var bookbook = allBookIDsAvailable[i][bookIDs[j]];
                                if (bookbook !== undefined) {
                                    
                                    //Add to proper list
                                    //book I need   ---- book you have available... done above
                                    //book you need ---- book I have available... do below
                                    if (bookbook.trade && !bookbook.pending) {

                                        //list of books that you can trade for given book 
                                        var yourPossTrades = []

                                        //Get books that can be traded for bookbook 
                                        for (var a = 0; a < allBookIDsNeeded.length; a++) {
                                            for (var b = 0; b < bookAvailableIDs.length; b++) {
                                                if(allBookIDsNeeded[a]){
                                                    if (allBookIDsNeeded[a][bookAvailableIDs[b]] !== undefined) {
                                                        for (var y = 0; y < availableInYourDir.length; y++) {
                                                            if (availableInYourDir[y].title === allBookIDsNeeded[a][bookAvailableIDs[b]].title) {
                                                              if (!availableInYourDir[y].pending && availableInYourDir[y].trade) {
                                                                yourPossTrades.push(availableInYourDir[y])        
                                                              }
                                                            }
                                                            
                                                        }
                                                        
                                                    }
                                                }
                                            }
                                            
                                        }

                                        //Debugging info 
                                        if(yourPossTrades.length !== 0) {
                                            console.log(yourPossTrades)
                                        }
                                        
                                        console.log("Adding trade: " + bookAvailableIDs[b])

                                        //add trade match
                                        tradeMatches.push(this.createBookListing(bookbook, allUserIDsAvailable[i], bookIDs[j], bookAvailableIDs[b], "T", yourPossTrades, allUserNamesAvailable[i]))

                                    }

                                    //Check for sale 
                                    if (bookbook.sale) {

                                        if (!allBookIDsAvailable[i][bookIDs[j]].pending) {
                                            saleMatches.push(this.createBookListing(bookbook, allUserIDsAvailable[i], bookIDs[j], bookAvailableIDs[b], "S", null, allUserNamesAvailable[i]))
                                        }                                        
                                                
                                    }


                                    //Check for donate
                                    if (bookbook.donate) {
                                       
                                        if (!allBookIDsAvailable[i][bookIDs[j]].pending) {
                                            donateMatches.push(this.createBookListing(bookbook, allUserIDsAvailable[i], bookIDs[j], bookAvailableIDs[b], "D", null, allUserNamesAvailable[i]))
                                        } 

                                    }
                                  }

                                }
                              }
                

                  displayMatches()
                });
              });
            });
          });
        });
      }
    })

  }


  

    listingCallBack(userId, bNeedId, bAvailId, method, tradeBooks, userName) {

        switch(method) {
            case "T":

                //open modal 
                this.setState({isModalOpen: true})

                //create listings for each book avail to trade
                var slider = document.getElementById("modalSlider")
                tradeBooks.forEach(item => {
                    console.log("Available Book: " + item.bookID)
                    console.log("Book Needed: " + bAvailId)
                    slider.appendChild(this.createBookListing(item, userId, bAvailId, item.bookID, "TO", null, null))  
                })

                
                break
            case "S":
                setPendingSale(userId, bNeedId, bAvailId)
                break
            case "D":
                setPendingDonate(userId, bNeedId, bAvailId)
                break
            case "TO":
                setPending(userId, bNeedId, bAvailId)
                break
        }
        
    }
    
    
    createBookListing(book, userId, bNeedId, bAvailId, method, tradeBooks, userName) {
        var listing = document.createElement('img')
        listing.src = book.bookImg
        listing.className = styles.listing
        listing.alt = book.title
        if (userName !== null) {
          listing.title = userName
        }
        listing.onclick = () => {
            this.listingCallBack(userId, bNeedId, book.bookID, method, tradeBooks, userName)
        }
        return listing 
    }

    //Modal functions
    afterOpenModal() {
        // references are now sync'd and can be accessed.
    }


    closeModal() {
        this.setState({isModalOpen: false})
    }
     


    render() {
            

        return (
            <div>

                <Modal 
                    id="tradeModal"
                    contentLabel="Select book to trade."
                    isOpen={this.state.isModalOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                >
                    <div>
                        <h3>Click on one of your books to trade for the selected book</h3>
                        <div id="modalSlider" className={styles.slider}>

                        </div>

                    </div>

                </Modal>


                <h1>Find Matches Here</h1>
                <p>Click a book to be paired with a trading partner</p>
                <button onClick={() => window.location.href = '/home'}>Home</button>
                <div id="matchesList"></div>
            </div>
        );
    }

}




//Display matches with respect to match type 
function displayMatches() {

    console.log("Displaying matches")

    //Get div to add matches to 
    var list = document.getElementById("matchesList");

    //Display trade matches first
    var trades = document.createElement("div")
    trades.className = "wrapper"
    trades.style.height = "auto"
    var tradesInner = document.createElement("div")
    tradesInner.className = "form-wrapper"

    //create trade slider
    var tradeSlider = document.createElement("div")
    tradeSlider.className = styles.slider

    //Create title for trades list
    var tradesTitle = document.createElement("h1")
    tradesTitle.innerHTML = "Available Trades"
    tradesTitle.style.textDecoration = "underline"
    tradesInner.appendChild(tradesTitle)

    tradeMatches.forEach(item => {
        tradeSlider.appendChild(item)
    })
    tradesInner.appendChild(tradeSlider)
    trades.appendChild(tradesInner)
    list.appendChild(trades)

    //Display donate matches 
    var donations = document.createElement("div")
    donations.className = "wrapper"
    donations.style.height = "auto"
    donations.style.marginTop = "10px"
    var donationsInner = document.createElement("div")
    donationsInner.className = "form-wrapper"

    var donateSlider = document.createElement("div")
    donateSlider.className = styles.slider

    //Create title
    var donationsTitle = document.createElement("h1")
    donationsTitle.innerHTML = "Available Donations"
    donationsTitle.style.textDecoration = "underline"
    donationsInner.appendChild(donationsTitle)

    donateMatches.forEach(item => {
        donateSlider.appendChild(item)
    })
    donationsInner.appendChild(donateSlider)
    donations.appendChild(donationsInner)
    list.appendChild(donations)


    //Display sale options
    var sales = document.createElement("div")
    sales.className="wrapper"
    sales.style.height = "auto"
    sales.style.marginTop = "10px"
    var salesInner = document.createElement("div")
    salesInner.className="form-wrapper"

    //create sales slider
    var salesSlider = document.createElement("div")
    salesSlider.className = styles.slider


    var salesTitle = document.createElement('h1')
    salesTitle.innerHTML = "Available Sales"
    salesTitle.style.textDecoration = "underline"
    salesInner.appendChild(salesTitle)

    saleMatches.forEach(item => {
        salesSlider.appendChild(item)
    })
    salesInner.appendChild(salesSlider)
    sales.appendChild(salesInner)
    list.appendChild(sales)


        

}

//get ALL booksNeeded IDs from database     
function getBooksNeededIDs(bookIDs, userID, callback) {
  var booksNeededPath = app.database().ref('users/' + userID + '/booksNeeded/');
  booksNeededPath.once('value')
    .then(function (snapshot) {
      snapshot.forEach(function (child) {
        var bookID = child.key;
        bookIDs.push(bookID);
      });
      callback();
    });
}

function getBooksAvailableIDs(bookIDs, userID, callback) {
  var booksAvailablePath = app.database().ref('users/' + userID + '/booksAvailable/');
  booksAvailablePath.once('value')
    .then(function (snapshot) {
      snapshot.forEach(function (child) {
        var bookID = child.key;
        bookIDs.push(bookID);
      });
      callback();
    });
}

function preventPendingTrades(bookIDs, userID, callback) {
  var booksAvailablePath = app.database().ref('users/' + userID + '/booksAvailable/');
  booksAvailablePath.once('value')
    .then(function (snapshot) {
      snapshot.forEach(function (child) {
        bookIDs.push(child.val());
      });
      callback();
    });
}

function getEverySingleDamnBookAvailable(allUserNamesAvailable, allUserIDsAvailable, allBookIDsAvailable, callback) {
  var booksAvailablePath = app.database().ref('users/');
  booksAvailablePath.once('value')
    .then(function (snapshot) {
      snapshot.forEach(function (user) {
        //console.log(user.key)
        var bookID = user.child("booksAvailable").val();
        allBookIDsAvailable.push(bookID);
        allUserIDsAvailable.push(user.key);
        allUserNamesAvailable.push(user.child("firstname").val() + " " + user.child('lastname').val())
      });
      callback();
    });
}

function getEverySingleDamnBookNeeded(allBookIDsNeeded, callback) {
  var booksNeededPath = app.database().ref('users/');
  booksNeededPath.once('value')
    .then(function (snapshot) {
      snapshot.forEach(function (user) {
        var bookID = user.child("booksNeeded").val();
        allBookIDsNeeded.push(bookID);
      });
      callback();
    });
}

function setPending(userAvailableID, bookNeededID, bookAvailableID) {
  app.auth().onAuthStateChanged(function (user) {
    if (user) {
      axios.post('/api/setPending', {
        userNeededID: user.uid,
        userAvailableID: userAvailableID,
        bookNeededID: bookNeededID,
        bookAvailableID: bookAvailableID
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        })
      if (!alert("Please proceed with your trade")) {
        window.location.href = "/trade"
      }
    }
  });
}

function setPendingSale(userAvailableID, bookNeededID, bookAvailableID) {
  app.auth().onAuthStateChanged(function (user) {
    if (user) {
      axios.post('/api/setPendingOneWay', {
        userNeededID: user.uid,
        userAvailableID: userAvailableID,
        bookNeededID: bookNeededID,
        bookAvailableID: bookAvailableID
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        })
      if (!alert("Please proceed with the sale")) {
        window.location.href = "/sale"
      }
    }
  });
}

function setPendingDonate(userAvailableID, bookNeededID, bookAvailableID) {
  app.auth().onAuthStateChanged(function (user) {
    if (user) {
      axios.post('/api/setPendingOneWay2', {
        userNeededID: user.uid,
        userAvailableID: userAvailableID,
        bookNeededID: bookNeededID,
        bookAvailableID: bookAvailableID
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        })
      if (!alert("Please proceed with the donation")) {
        window.location.href = "/donate"
      }
    }
  });
}

export default Match;
import React, { Component, useCallback } from 'react';
import app from "./base.js";
import axios from "axios"
import { GiftedChat, Bubble, Colors } from "react-web-gifted-chat";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import overwrites from "./chat.module.css"


var tradePartnerIDs = [];
var currentUser;
var currentProfilePic;
class Donate extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      user: {},
    };
  }
  componentDidMount() {
    app.auth().onAuthStateChanged(user => {
      if (user) {
        currentUser = user.email;
        currentProfilePic = user.photoURL;
        this.setState({ user });
        var saveState = this;
      } else {
        this.setState({
          user: {},
          messages: []
        });
      }
      var title1;
      var bookIDs1 = [];
      var goto2 = [];
      goto2[0] = 'false';
      var tradePartnerNames = [];
      getPending1(goto2, bookIDs1, title1, function () {
        if (goto2[0] === 'true') {
          getPending2(bookIDs1, title1, function () {
            getTradePartnerID2(tradePartnerIDs, bookIDs1[0], function () {
              if (!tradePartnerIDs[0]) {
                if (!alert("You do not have a current donation!")) {
                  window.location.href = "/home"
                }
              }
              else {
                getTradePartnerName(tradePartnerNames, tradePartnerIDs[0], function() {
                  console.log(tradePartnerNames[0] + tradePartnerNames[1]);
                });
                saveState.loadMessages();
              }
            });
          });
        }
        else {
          getTradePartnerID(tradePartnerIDs, bookIDs1[0], function () {
            if (!tradePartnerIDs[0]) {
              if (!alert("You do not have a current donation!")) {
                window.location.href = "/home"
              }
            }
            else {
              getTradePartnerName(tradePartnerNames, tradePartnerIDs[0], function() {
                console.log(tradePartnerNames[0] + tradePartnerNames[1]);
              });
              saveState.loadMessages();
            }
          });
        }
      });
    });
  }
  loadMessages() {
    const callback = snap => {
      const message = snap.val();
      message.id = snap.key;
      const { messages } = this.state;
      messages.push(message);
      this.setState({ messages });
    };
    app.auth().onAuthStateChanged(function (user) {
      app.database().ref("/users/" + user.uid + "/messages/" + tradePartnerIDs[0]).limitToLast(12).on("child_added", callback);
    });

  }

  onSend(messages) {
    for (const message of messages) {
      this.saveMessage(message);
    }
  }

  saveMessage(message) {
    app.auth().onAuthStateChanged(function (user) {
      //message.text = message.user.substring(0, message.user.indexOf('@')) + '\n\n' + message.text;
      app.database().ref("/users/" + tradePartnerIDs[0] + "/messages/" + user.uid).push(message)
        .catch(function (error) {
          console.error("Error saving message to database:", error);
        });
      app.database().ref("/users/" + user.uid + "/messages/" + tradePartnerIDs[0]).push(message)
        .catch(function (error) {
          console.error("Error saving message to database:", error);
        });
    });
  }

  renderChat() {
    return (
      <GiftedChat
        user={{
          avatar: currentProfilePic,
          id: currentUser,
        }}
        messages={this.state.messages.slice().reverse()}
        onSend={messages => this.onSend(messages)}
      />
    );
  }

  renderBooksHeader() {
    return (
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Books / Donate
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
  renderOptionsHeader() {
    return (
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Options
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }

  renderAcceptButton() {
    return <Button onClick={(e) => { confirmSale(document.getElementById("user2").innerHTML, document.getElementById("book1").innerHTML, document.getElementById("book2").innerHTML); }}>Accept Donation</Button>
  }
  renderCancelButton() {
    return <Button onClick={(e) => { removePendingOneWay(document.getElementById("user2").innerHTML, document.getElementById("book1").innerHTML, document.getElementById("book2").innerHTML); }}>Cancel Donation</Button>
  }
  renderHomeButton() {
    return <Button onClick={() => window.location.href = '/home'}>Home</Button>
  }

  render() {
    return (
      <div className={overwrites.overwrites} style={styles.container}>
        <div style={styles.channelList}>
          {this.renderBooksHeader()}
          <List>
            <ListItem>
              <ListItemText primary="Book you will receive"></ListItemText>
            </ListItem>
            <ListItem button>
              <ListItemAvatar>
                <Avatar>T</Avatar>
              </ListItemAvatar>
              <ListItemText id="title1"></ListItemText>
              <h3 id="book1"></h3>
            </ListItem>
          </List>

          <List>
            <ListItem>
              <ListItemText primary="Book you will donate"></ListItemText>
            </ListItem>
            <ListItem button>
              <ListItemAvatar>
                <Avatar>T</Avatar>
              </ListItemAvatar>
              <ListItemText id="title2"></ListItemText>
              <h3 id="book2"></h3>
              <h3 id="user2"></h3>

            </ListItem>
          </List>
        </div>
        <div style={styles.chat}>
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography variant="h6" color="inherit">
                <p id="fullname"></p>
                <p id="user2firstname"></p>
                <p id="user2lastname"></p>
              </Typography>
            </Toolbar>
          </AppBar>
          {this.renderChat()}
        </div>
        <div style={styles.settings}>
          {this.renderOptionsHeader()}
          {this.renderAcceptButton()}
          {this.renderCancelButton()}
          {this.renderHomeButton()}
        </div>
      </div>
    );
  }
}

//accept a trade so all books are removed from available and needed lists
function removeSale(userAvailableID, bookNeededID, bookAvailableID) {
  if (!userAvailableID) {
    console.log("no sales")
    return;
  }
  app.auth().onAuthStateChanged(function (user) {
    if (user) {
      axios.post('/api/removeSale', {
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
      if (!alert("Sale accepted!")) {
        window.location.href = '/home';
      }
    }
  });
}


//IF YOUR BOOK NEEDED
function getPending1(goto2, bookIDs, title, callback) {
  app.auth().onAuthStateChanged(function (user) {
    var wtf = false;
    var booksNeededPath = app.database().ref('users/' + user.uid + '/booksNeeded/');
    booksNeededPath.once('value')
      .then(function (snapshot) {
        snapshot.forEach(function (book) {
          if (book.child("pending").val()) {

            if (book.child("donate").val()) {
              bookIDs.push(book.key)
              title = book.child("title").val();

              document.getElementById("title1").innerHTML = title;
              document.getElementById("book1").innerHTML = bookIDs[0];
              document.getElementById("book1").style.display = "none";
              wtf = true;
            }
          }
        });
        if (!wtf) {
          goto2[0] = 'true'
        }
        callback();
      });
  });
}

//IF YOUR BOOK AVAILABLE
function getPending2(bookIDs, title, callback) {
  app.auth().onAuthStateChanged(function (user) {
    var booksNeededPath = app.database().ref('users/' + user.uid + '/booksAvailable/');
    booksNeededPath.once('value')
      .then(function (snapshot) {
        snapshot.forEach(function (book) {
          if (book.child("pending").val() && book.child("donate").val()) {
            bookIDs.push(book.key);
            title = book.child("title").val();
            document.getElementById("title2").innerHTML = title;
            document.getElementById("book2").innerHTML = bookIDs[0];
            document.getElementById("book2").style.display = "none";
          }
        });
        callback();
      });
  });
}

function getTradePartnerID(tradePartnerIDs, bookID, callback) {
  app.auth().onAuthStateChanged(function (user) {
    var tradePartnerPath = app.database().ref('users/' + user.uid + '/booksNeeded/' + bookID);
    tradePartnerPath.once('value')
      .then(function (snapshot) {
        tradePartnerIDs.push(snapshot.child("tradePartner").val());
        document.getElementById("user2").innerHTML = tradePartnerIDs[0];
        document.getElementById("user2").style.display = "none";
        callback();
      });
  });
}

function getTradePartnerID2(tradePartnerIDs, bookID, callback) {
  app.auth().onAuthStateChanged(function (user) {
    var tradePartnerPath = app.database().ref('users/' + user.uid + '/booksAvailable/' + bookID);
    tradePartnerPath.once('value')
      .then(function (snapshot) {
        tradePartnerIDs.push(snapshot.child("tradePartner").val());
        document.getElementById("user2").innerHTML = tradePartnerIDs[0];
        document.getElementById("user2").style.display = "none";
        callback();
      });
  });
}


function getTradePartnerName(tradePartnerNames, user2id, callback) {
  app.auth().onAuthStateChanged(function (user) {
    var tradePartnerPath = app.database().ref('users/' + user2id);
    tradePartnerPath.once('value')
      .then(function (snapshot) {
        tradePartnerNames.push(snapshot.child("firstname").val());
        tradePartnerNames.push(snapshot.child("lastname").val());
        document.getElementById("user2firstname").innerHTML = tradePartnerNames[0];
        document.getElementById("user2lastname").innerHTML = tradePartnerNames[1];
        document.getElementById("user2firstname").style.display = "none";
        document.getElementById("user2lastname").style.display = "none";
        document.getElementById("fullname").innerHTML = "Chat with " + tradePartnerNames[0] + " " + tradePartnerNames[1];
        callback();
      });
  });
}

//cancel a trade so it is no longer pending
function removePendingOneWay(userAvailableID, bookNeededID, bookAvailableID) {
  if (!userAvailableID) {
    console.log("no trades")
    return;
  }
  app.auth().onAuthStateChanged(function (user) {
    if (user) {
      axios.post('/api/removePendingOneWay2', {
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
      if (!alert("Donation cancelled!")) {
        window.location.href = '/home';
      }
    }
  });
}


function confirmSale(userAvailableID, bookNeededID, bookAvailableID) {
  if (!userAvailableID) {
    console.log("no trades")
    return;
  }
  app.auth().onAuthStateChanged(function (user) {
    if (user) {
      //console.log('users/' + user.uid + '/booksNeeded/' + bookNeededID)
      axios.post('/api/confirmSale', {
        userNeededID: user.uid,
        bookNeededID: bookNeededID,
        bookAvailableID: bookAvailableID
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      var booksNeededPath;
      if (bookAvailableID) {
        booksNeededPath = app.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID);
      }
      if (bookNeededID) {
        booksNeededPath = app.database().ref('users/' + userAvailableID + '/booksAvailable/' + bookNeededID);
      }
      booksNeededPath.once('value')
        .then(function (snapshot) {
          if (snapshot.val().confirmed) {
            removeSale(document.getElementById("user2").innerHTML, document.getElementById("book1").innerHTML, document.getElementById("book2").innerHTML);
            return;
          }
          else {
            if (!alert("Donation confirmed, waiting on donation partner!")) {
              window.location.reload();
            }
          }
        });
    }
  });
}
const styles = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    height: "97vh",
  },
  channelList: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
  chat: {
    display: "flex",
    flex: 3,
    flexDirection: "column",
    borderWidth: "1px",
    borderColor: "#ccc",
    borderRightStyle: "solid",
    borderLeftStyle: "solid",
  },
  settings: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
};

export default Donate;
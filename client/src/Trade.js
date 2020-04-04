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


var tradePartnerIDs = [];
var currentUser;
class Trade extends Component {
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
        user.updateProfile({
          photoURL: "https://cdn0.iconfinder.com/data/icons/iphone-black-people-svg-icons/40/agent_user_stock_spy_mail_help_hat_vehicle_vector_trustee-512.png"       
       })
        console.log(user.photoURL)
        currentUser = user.email;
        this.setState({ user });
        this.loadMessages();
      } else {
        this.setState({
          user: {
            
          },
          messages: []
        });
      }
        var title1;
        var title2;
        var bookIDs1 = [];
        var bookIDs2 = [];
        // var tradePartnerIDs = [];
        getPending1(bookIDs1, title1, function(){
          getTradePartnerID(tradePartnerIDs, bookIDs1[0], function() {
            console.log(tradePartnerIDs[0])
            console.log(bookIDs1[0])
            if (!tradePartnerIDs[0]) {
              if (!alert("You do not have a current trade!")) {
                window.location.href = "/home"
              }
            }
          });
        });
        getPending2(bookIDs2, title2, function() {
        });
    });
  }


  loadMessages() {
    console.log(currentUser)
    console.log(tradePartnerIDs[0]);
    const callback = snap => {
      console.log(snap.val().user)
      const message = snap.val();
      message.id = snap.key;
      const { messages } = this.state;
      messages.push(message);
      this.setState({ messages });
    };
    app.auth().onAuthStateChanged(function (user) {
      app.database().ref("/users/" + user.uid + "/messages/").limitToLast(12).on("child_added", callback);
      app.database().ref("/users/" + tradePartnerIDs[0] + "/messages/").limitToLast(12).on("child_added", callback);
    });

  }

  onSend(messages) {
    for (const message of messages) {
      this.saveMessage(message);
    }
  }

  saveMessage(message) {
    app.auth().onAuthStateChanged(function (user) {
      console.log(message.text)
      console.log(message.user)
      console.log(message.text + '\n' + message.user)
      message.text = message.user.substring(0, message.user.indexOf('@')) + '\n\n' + message.text;
      app.database().ref("/users/" + tradePartnerIDs[0] + "/messages/").push(message)
      .catch(function(error) {
        console.error("Error saving message to Database:", error);
      });
      app.database().ref("/users/" + user.uid + "/messages/").push(message)
        .catch(function(error) {
          console.error("Error saving message to Database:", error);
        });
    });
  }

  renderChat() {
    // console.log(currentUser)
    // console.log(this.state.messages)
    return (
      <GiftedChat
        user={currentUser}
        renderAvatar={"https://cdn0.iconfinder.com/data/icons/iphone-black-people-svg-icons/40/agent_user_stock_spy_mail_help_hat_vehicle_vector_trustee-512.png"}
        messages={this.state.messages.slice().reverse()}
        onSend={messages => this.onSend(messages)}
      />
      // <GiftedChat 
      //   renderUsernameOnMessage={true} 
      //   messages={this.state.messages} 
      //   onSend={messages => this.onSend(messages)} 
      //   user={currentUser}
      // />
    );
  }

  renderBooksHeader() {
    return (
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Books
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
  renderChatHeader() {
    return (
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Default channel
            <h3 id="user2"></h3>
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
    return <Button onClick={ (e) => { confirmTrade(document.getElementById("user2").innerHTML, document.getElementById("book1").innerHTML, document.getElementById("book2").innerHTML);}}>Accept Trade</Button>
  }
  renderCancelButton() {
    return <Button onClick={ (e) => { removePending(document.getElementById("user2").innerHTML, document.getElementById("book1").innerHTML, document.getElementById("book2").innerHTML);}}>Cancel Trade</Button>
  }
  renderHomeButton() {
    return <Button onClick={() => window.location.href = '/home'}>Home</Button>
  }

  
  render() {
    console.log(tradePartnerIDs[0])
    return (
      <div style={styles.container}>
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
              <ListItemText primary="Book you will trade"></ListItemText>
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
            Chat
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
function removeTrade(userAvailableID, bookNeededID, bookAvailableID) {
    console.log(userAvailableID)
    if (!userAvailableID) {
      console.log("no trades")
      return;
    }
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        axios.post('/api/removeTrade', {
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
        if (!alert("Trade accepted!")) {
            window.location.href = '/home';
        }
      }
    });
  }


function getPending1(bookIDs, title, callback) {
  app.auth().onAuthStateChanged(function (user) {
    var booksNeededPath = app.database().ref('users/' + user.uid + '/booksNeeded/');
    booksNeededPath.once('value')
        .then(function (snapshot) {
          snapshot.forEach(function (book) {
            console.log(book.child("trade").val())
            if (book.child("pending").val() && book.child("trade").val()) {
              console.log(book.key)
              console.log(book.child("title").val())
              bookIDs.push(book.key)
              title = book.child("title").val();
              document.getElementById("title1").innerHTML = title;
              document.getElementById("book1").innerHTML = bookIDs[0];
              document.getElementById("book1").style.display = "none";
            }
          });  
          callback();
        });
  });
}

function getPending2(bookIDs, title, callback) {
  app.auth().onAuthStateChanged(function (user) {
    var booksNeededPath = app.database().ref('users/' + user.uid + '/booksAvailable/');
    booksNeededPath.once('value')
        .then(function (snapshot) {
          snapshot.forEach(function (book) {
            if (book.child("pending").val() && book.child("trade").val()) {
              console.log(book.key)
              console.log(book.child("title").val())
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
      .then(function(snapshot) {
        console.log(snapshot.child("tradePartner").val())
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
      .then(function(snapshot) {
        tradePartnerNames.push(snapshot.child("firstname").val());
        tradePartnerNames.push(snapshot.child("lastname").val());
        document.getElementById("user2firstname").innerHTML = tradePartnerNames[0];
        document.getElementById("user2lastname").innerHTML = tradePartnerNames[1];
      });
      callback();
  });
}

//cancel a trade so it is no longer pending
function removePending(userAvailableID, bookNeededID, bookAvailableID) {
    if (!userAvailableID) {
      console.log("no trades")
      return;
    }
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        axios.post('/api/removePending', {
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
        if (!alert("Trade cancelled!")) {
          window.location.href = '/home';
        }
      }
    });
  }


  function confirmTrade(userAvailableID, bookNeededID, bookAvailableID) {
    console.log(userAvailableID)
    if (!userAvailableID) {
      console.log("no trades")
      return;
    }
    app.auth().onAuthStateChanged(function (user) {
      if (user) {
        //console.log('users/' + user.uid + '/booksNeeded/' + bookNeededID)
        axios.post('/api/confirmTrade', {
          userNeededID: user.uid,
          bookNeededID: bookNeededID
        })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
        console.log('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID)
        var booksNeededPath = app.database().ref('users/' + userAvailableID + '/booksNeeded/' + bookAvailableID);
        booksNeededPath.once('value')
          .then(function (snapshot) {
            if (snapshot.val().confirmed) {
              console.log("hi")
              removeTrade(document.getElementById("user2").innerHTML, document.getElementById("book1").innerHTML, document.getElementById("book2").innerHTML);
              return;
            }
            else {
              if (!alert("Trade confirmed, waiting on trade partner!")) {
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
      height: "100vh",
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

export default Trade;
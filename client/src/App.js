import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import SignUp from "./SignUp";
import Profile from "./Profile";
import Search from "./Search";
import { AuthProvider } from "./Auth";
import PrivateRoute from "./PrivateRoute";
import UploadImage from "./components/UploadImage";
import BooksNeeded from "./BooksNeeded";
import BooksAvailable from "./BooksAvailable";
import Match from "./Match";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Route exact path="/match" component={Match} />
          <Route exact path="/booksAvailable" component={BooksAvailable} />
          <Route exact path="/booksNeeded" component={BooksNeeded} />
          <Route exact path="/search" component={Search} />
          <Route exact path="/components/UploadImage" component={UploadImage} />
          <Route exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/home" component={Home} />
          <Route exact path="/" component={Login} />
          <Route exact path="/signup" component={SignUp} />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

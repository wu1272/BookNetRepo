import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Startup from "./Startup"
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

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Route exact path="/booksAvailable" component={BooksAvailable} />
          <Route exact path="/booksNeeded" component={BooksNeeded} />
          <Route exact path="/search" component={Search} />
          <Route exact path="/components/UploadImage" component={UploadImage} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/" component={Startup} />
          <PrivateRoute exact path="/home" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

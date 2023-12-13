import React, { Component } from "react";
import { Container, Header, Image } from "semantic-ui-react";
import Registration from "./registration/registration";
import Login from "./registration/login";
import "./auth.css";
import { SERVER_ADDRESS } from "../constants";

class Auth extends Component {
  handleGoogleSignUp = () => {
    window.location.href = SERVER_ADDRESS + "/auth/google/";
  };
  render() {
    return (
      <Container fluid className="auth-container">
        <div className="topbar">
          <Header as="h1">RiceBook</Header>
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Rice_Owls_logo.svg/800px-Rice_Owls_logo.svg.png"
            height={100}
            width={100}
          />
        </div>
        <div className="content-container">
          <div className="registration-container">
            <Registration />
          </div>
          <div className="login-container">
            <Login />

            <button onClick={this.handleGoogleSignUp}>
              <img
                src="https://expresswriters.com/wp-content/uploads/2015/09/google-new-logo-450x450.jpg"
                alt="Google Logo"
                height={24}
                width={24}
              />
              Sign Up with Google
            </button>
          </div>
        </div>
      </Container>
    );
  }
}

export default Auth;

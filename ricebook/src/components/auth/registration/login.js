import React, { Component } from "react";
import { Form, Button, Header } from "semantic-ui-react";
import withNavigateHook from "../../../navigateHook";
import "./login.css";
import axios from "axios";
import { SERVER_ADDRESS } from "../../constants";
// import { Cookies } from "react-cookie";

// const cookie = new Cookies();
class Login extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      userName: "",
      passWord: "",
      errorMessage: "",
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errorMessage: "",
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      username: this.state.userName,
      password: this.state.passWord,
    };

    try {
      let cookie;
      const response = await axios
        .post(SERVER_ADDRESS + "/login", loginData, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((response) => {
          cookie = response.headers.get("set-cookie");
          return response;
        });

      if (response.status === 200) {
        const result = response.data;
        // const header = response.headers.get("set-cookie");
        console.log(cookie + "here is the cookie");
        if (result.result === "success") {
          sessionStorage.setItem("username", result.username);
          sessionStorage.setItem("userData", JSON.stringify(result));
          this.props.navigation("/main");
          console.log("Login Successful:", result);
        } else {
          this.setState({
            errorMessage: "Invalid Credentials",
          });
        }
      } else {
        this.setState({
          errorMessage: "Login failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      this.setState({
        errorMessage: "Login failed. Please try again.",
      });
    }
  };

  render() {
    return (
      <div className="login-container">
        <Header as="h2">Login</Header>
        <Form onSubmit={this.handleSubmit} className="ui form">
          <Form.Field className="field">
            <label>Display Name</label>
            <input
              type="text"
              name="userName"
              placeholder="username"
              value={this.state.userName}
              onChange={this.handleChange}
              required
            />
          </Form.Field>
          <Form.Field className="field">
            <label>Password</label>
            <input
              type="password"
              name="passWord"
              placeholder="password"
              value={this.state.passWord}
              onChange={this.handleChange}
              required
            />
          </Form.Field>
          <div className="button-container">
            <Button data-testid="login-button" type="submit">
              Login
            </Button>
          </div>
        </Form>
        {this.state.errorMessage && (
          <div className="errorMessage">{this.state.errorMessage}</div>
        )}
      </div>
    );
  }
}

export default withNavigateHook(Login);

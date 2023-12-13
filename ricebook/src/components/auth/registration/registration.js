import React, { Component } from "react";
import { Form, Button, Header, Message } from "semantic-ui-react"; // Import Semantic UI components
import "./registration.css";
import withNavigateHook from "../../../navigateHook";
import axios from "axios";
import { SERVER_ADDRESS } from "../../constants";

class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountName: "",
      displayName: "",
      emailAddress: "",
      phoneNumber: "",
      dateOfBirth: "",
      zipCode: "",
      password: "",
      confirmPassword: "",
      errors: {},
      registrationSuccess: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  convertPhoneNumber = (formattedPhoneNumber) => {
    const numericPhoneNumber = formattedPhoneNumber.replace(/\D/g, "");
    return numericPhoneNumber;
  };
  validateForm = () => {
    const errors = {};

    const requiredFields = [
      "accountName",
      "emailAddress",
      "phoneNumber",
      "dateOfBirth",
      "zipCode",
      "password",
      "confirmPassword",
    ];

    requiredFields.forEach((field) => {
      if (!this.state[field]) {
        errors[field] = "This field is required";
      }
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.state.emailAddress && !emailRegex.test(this.state.emailAddress)) {
      errors.emailAddress = "Please enter a valid email address";
    }

    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (this.state.phoneNumber && !phoneRegex.test(this.state.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid phone number (10 digits)";
    }

    const zipCode = /^\d{5}$/;
    if (this.state.zipCode && !zipCode.test(this.state.zipCode)) {
      errors.zipCode = "Please enter a valid zip code";
    }

    const today = new Date();
    const birthDate = new Date(this.state.dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      errors.dateOfBirth = "You must be 18 years or older to register";
    }

    const accountNameRegex = /^[a-zA-Z][a-zA-Z0-9]*$/;
    if (!accountNameRegex.test(this.state.accountName)) {
      errors.accountName =
        "Account name must start with a letter, and can only contain letters and numbers";
    }

    if (this.state.password !== this.state.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }
    const numericPhoneNumber = this.convertPhoneNumber(this.state.phoneNumber);

    const userData = {
      username: this.state.displayName,
      email: this.state.emailAddress,
      name: this.state.accountName,
      password: this.state.password,
      phoneNumber: parseInt(numericPhoneNumber),
      zipcode: parseInt(this.state.zipCode),
      dob: this.state.dateOfBirth,
    };

    try {
      const response = await axios.post(
        SERVER_ADDRESS + "/register",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        const result = response.data;
        console.log(result);
        if (result.result === "success") {
          sessionStorage.setItem("username", result.username);
          sessionStorage.setItem("userData", JSON.stringify(result));
          this.setState({
            registrationSuccess: true,
          });
        } else {
          this.setState({
            errors: {
              ...this.state.errors,
              registrationError: "Registration failed. Please try again.",
            },
          });
        }
      } else {
        this.setState({
          errors: {
            ...this.state.errors,
            registrationError: "Registration failed. Please try again.",
          },
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      this.setState({
        errors: {
          ...this.state.errors,
          registrationError: "Registration failed. Please try again.",
        },
      });
    }
  };

  render() {
    const { errors, registrationSuccess } = this.state;

    return (
      <div className="reg-container">
        <Header as="h2">Register</Header>
        {registrationSuccess && (
          <Message positive>
            <Message.Header>Registration Successful</Message.Header>
            <p>User registered successfully. Please login.</p>
          </Message>
        )}
        <Form className="ui form" onSubmit={this.handleSubmit}>
          <Form.Field className="field">
            <label>Account Name</label>
            <input
              type="text"
              name="accountName"
              value={this.state.accountName}
              onChange={this.handleChange}
              required
              autoComplete="off"
            />
            {errors.accountName && (
              <Message negative>{errors.accountName}</Message>
            )}
          </Form.Field>
          <Form.Field className="field">
            <label>Display Name</label>
            <input
              type="text"
              name="displayName"
              value={this.state.displayName}
              onChange={this.handleChange}
            />
            {errors.displayName && (
              <Message negative>{errors.displayName}</Message>
            )}
          </Form.Field>
          <Form.Field className="field">
            <label>Email Address</label>
            <input
              type="email"
              name="emailAddress"
              value={this.state.emailAddress}
              onChange={this.handleChange}
              required
            />
          </Form.Field>
          <Form.Field className="field">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={this.state.phoneNumber}
              onChange={this.handleChange}
              required
            />
            {errors.phoneNumber && (
              <Message negative>{errors.phoneNumber}</Message>
            )}
          </Form.Field>
          <Form.Field className="field">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={this.state.dateOfBirth}
              onChange={this.handleChange}
              required
            />
            {errors.dateOfBirth && (
              <Message negative>{errors.dateOfBirth}</Message>
            )}
          </Form.Field>
          <Form.Field className="field">
            <label>Zipcode</label>
            <input
              type="text"
              name="zipCode"
              value={this.state.zipCode}
              onChange={this.handleChange}
              required
            />
            {errors.zipCode && <Message negative>{errors.zipCode}</Message>}
          </Form.Field>
          <Form.Field className="field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              required
            />
          </Form.Field>
          <Form.Field className="field">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              required
            />
            {errors.confirmPassword && (
              <Message negative>{errors.confirmPassword}</Message>
            )}
          </Form.Field>

          <div className="button-container">
            <Button type="submit" className="ui button">
              Register
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default withNavigateHook(Registration);

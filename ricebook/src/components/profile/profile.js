import React, { Component } from "react";
import "./profile.css";
import { Container, Header, Image, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { SERVER_ADDRESS } from "../constants";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passWord: "",
      avatar: "",
      newInfo: {
        userName: "",
        email: "",
        phoneNumber: "",
        zipCode: "",
        passWord: "",
        avatar: "",
      },
      formSubmitted: false,
      usernameValid: true,
      emailValid: true,
      phoneValid: true,
      zipCodeValid: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.handleUpdateInfo = this.handleUpdateInfo.bind(this);
    this.fetchUserData = this.fetchUserData.bind(this);
  }

  componentDidMount() {
    this.fetchUserData();
  }
  fetchUserData = async () => {
    try {
      const response = await fetch(SERVER_ADDRESS + "/self", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();

        this.setState({
          userName: userData.username,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          zipCode: userData.zipcode,
          passWord: "********",
          avatar: userData.avatar,
        });
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error during fetchUserData:", error);
    }
  };

  handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.setState((prevState) => ({
        newInfo: {
          ...prevState.newInfo,
          avatar: file,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  handleChange = (e) => {
    console.log("Input change");
    const { name, value } = e.target;
    this.setState((prevState) => ({
      newInfo: {
        ...prevState.newInfo,
        [name]: value,
      },
    }));
  };

  generateAsterisks = (length) => {
    return "*".repeat(length);
  };

  handleUsernameChange = (e) => {
    const username = e.target.value;
    console.log(username);
    const usernameValid =
      username === "" || /^[a-zA-Z][a-zA-Z0-9]*$/.test(username);
    this.setState((prevState) => ({
      newInfo: {
        ...prevState.newInfo,
        userName: username,
      },
      usernameValid,
    }));
  };

  handleEmailChange = (e) => {
    const email = e.target.value;
    const emailValid = email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    this.setState((prevState) => ({
      newInfo: {
        ...prevState.newInfo,
        email,
      },
      emailValid,
    }));
  };

  handlePhoneChange = (e) => {
    const phoneNumber = e.target.value;
    const phoneValid =
      phoneNumber === "" || /^\d{3}-\d{3}-\d{4}$/.test(phoneNumber);
    this.setState((prevState) => ({
      newInfo: {
        ...prevState.newInfo,
        phoneNumber,
      },
      phoneValid,
    }));
  };

  handleZipCodeChange = (e) => {
    const zipCode = e.target.value;
    const zipCodeValid = zipCode === "" || /^\d{5}$/.test(zipCode);
    this.setState((prevState) => ({
      newInfo: {
        ...prevState.newInfo,
        zipCode,
      },
      zipCodeValid,
    }));
  };

  updateField = async (field, value) => {
    try {
      const response = await fetch(SERVER_ADDRESS + `/${field}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          [field]: value,
        }),
      });

      if (!response.ok) {
        console.error(`Failed to update ${field}`);
        throw new Error(`Failed to update ${field}`);
      }
    } catch (error) {
      throw error;
    }
  };

  updatePhoneNumber = async (phoneNumber) => {
    try {
      const response = await fetch(SERVER_ADDRESS + "/phone", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          phoneNumber,
        }),
      });

      if (!response.ok) {
        console.error("Failed to update phone");
        throw new Error("Failed to update phone");
      }
    } catch (error) {
      throw error;
    }
  };

  updateAvatar = async (avatar) => {
    try {
      const formData = new FormData();
      formData.append("avatar", avatar);

      const response = await fetch(SERVER_ADDRESS + "/avatar", {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        console.error("Failed to update avatar");
        throw new Error("Failed to update avatar");
      }
    } catch (error) {
      throw error;
    }
  };

  formatPhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/[^0-9]/g, "");
  };

  handleUpdateInfo = async (e) => {
    e.preventDefault();
    const {
      newInfo,
      usernameValid,
      emailValid,
      phoneValid,
      zipCodeValid,
      avatar,
    } = this.state;

    if (
      !usernameValid ||
      !emailValid ||
      !phoneValid ||
      !zipCodeValid ||
      !avatar
    ) {
      return;
    }

    try {
      if (newInfo.email) {
        await this.updateField("email", newInfo.email);
      }

      if (newInfo.phoneNumber) {
        const numericPhoneNumber = this.formatPhoneNumber(newInfo.phoneNumber);
        console.log("Numeric Phone:", numericPhoneNumber);
        await this.updatePhoneNumber(numericPhoneNumber);
      }

      if (newInfo.zipCode) {
        await this.updateField("zipcode", newInfo.zipCode);
      }

      if (newInfo.passWord) {
        await this.updateField("password", newInfo.passWord);
      }

      if (newInfo.avatar) {
        await this.updateAvatar(newInfo.avatar);
      }

      this.fetchUserData();
      this.setState({
        formSubmitted: true,
      });
    } catch (error) {
      throw error;
    }
  };

  render() {
    const {
      userName,
      // usernameValid,
      email,
      emailValid,
      phoneNumber,
      phoneValid,
      passWord,
      zipCode,
      zipCodeValid,
      avatar,
      newInfo,
    } = this.state;

    return (
      <Container className="profile-container">
        <div className="topbar-profile">
          <Header as="h1">RiceBook</Header>
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Rice_Owls_logo.svg/800px-Rice_Owls_logo.svg.png"
            height={100}
            width={100}
          />
        </div>

        <div className="mainpage-link">
          <Link to="/main">Main Page</Link>
        </div>

        <div className="picture-upload">
          <Image
            src={avatar}
            size="small"
            height="100px"
            width="100px"
            circular
          />
          <input
            className="img-input"
            type="file"
            onChange={this.handleImageUpload}
            accept="image/*"
          />
          <label htmlFor="fileInput"></label>
          <Button primary onClick={this.handleUpdateInfo}>
            Upload
          </Button>
        </div>

        <div className="current-info">
          <Header as="h2">Current Information</Header>
          <p className="name">Username: {userName}</p>
          <p className="email">Email: {email}</p>
          <p className="phone">Phone Number: {phoneNumber}</p>
          <p className="zip">Zip Code: {zipCode}</p>
          <p className="pass">
            Password:{" "}
            {this.state.showPassword
              ? passWord
              : this.generateAsterisks(passWord.length)}
          </p>
        </div>

        <div className="update-info">
          <Header as="h2">Update Information</Header>
          {/* <input
            type="text"
            name="userName"
            placeholder="New Username"
            value={newInfo.userName}
            onChange={this.handleUsernameChange}
          />
          {usernameValid ? null : (
            <span className="error">Invalid username</span>
          )} */}
          <input
            type="text"
            name="email"
            placeholder="New Email"
            value={newInfo.email}
            onChange={this.handleEmailChange}
          />
          {emailValid ? null : <span className="error">Invalid email</span>}
          <input
            type="tel"
            name="phoneNumber"
            placeholder="New Phone Number"
            value={newInfo.phoneNumber}
            onChange={this.handlePhoneChange}
          />
          {phoneValid ? null : (
            <span className="error">Invalid phone number</span>
          )}
          <input
            type="text"
            name="zipCode"
            placeholder="New zipCode"
            value={newInfo.zipCode}
            onChange={this.handleZipCodeChange}
          />
          {zipCodeValid ? null : (
            <span className="error">Invalid zip code</span>
          )}
          <input
            type="password"
            name="passWord"
            placeholder="New Password"
            value={newInfo.passWord}
            onChange={this.handleChange}
          />
          <br />
          <Button
            data-testid="update-button"
            primary
            onClick={this.handleUpdateInfo}
          >
            Update
          </Button>
        </div>
      </Container>
    );
  }
}

export default Profile;

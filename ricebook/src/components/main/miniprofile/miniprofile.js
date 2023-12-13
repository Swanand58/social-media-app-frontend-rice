import React, { Component } from "react";
import { Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import "./miniprofile.css";
import axios from "axios";
import { SERVER_ADDRESS } from "../../constants";

class MiniProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: "",
      username: "",
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    // this.fetchAvatar();
    this.fetchUsername();
  }

  // fetchAvatar = async () => {
  //   try {
  //     const response = await axios.get(
  //       "https://finalproject-ricebook-server-04f59a3aae80.herokuapp.com/avatar",
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     const { avatar } = response.data;

  //     this.setState({
  //       avatar,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching avatar:", error);
  //   }
  // };

  fetchUsername = async () => {
    try {
      const response = await fetch(SERVER_ADDRESS + "/self", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        this.setState({
          username: userData.username,
          avatar: userData.avatar,
        });
      }
    } catch (error) {
      console.log("Error fetching username:", error);
    }
  };

  handleLogout = async () => {
    try {
      const response = await axios.put(SERVER_ADDRESS + "/logout", null, {
        withCredentials: true,
      });
      console.log(response);

      if (response.status === 200) {
        sessionStorage.clear();
        localStorage.clear();
        
        // window.location.href = "/";
        console.log("Logout Successful");
      } else {
        console.error("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  handleProfile = () => {
    window.location.href = "/profile";
  };
  render() {
    // const userData = sessionStorage.getItem("username");
    const { avatar, username } = this.state;
    return (
      <div className="profile-container">
        <div className="links">
          <Link data-testid="logout-button" to="/" onClick={this.handleLogout}>
            Logout
          </Link>
          <Link to="/profile">Profile</Link>
        </div>
        <div className="mini-profile">
          <Image
            src={avatar}
            size="mini"
            height="100px"
            width="100px"
            circular
          />
          <h3>{username}</h3>
        </div>
      </div>
    );
  }
}
export default MiniProfile;

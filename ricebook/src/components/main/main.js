import React, { Component } from "react";
import MiniProfile from "./miniprofile/miniprofile";
import StatusUpdate from "./miniprofile/statusupdate";
import { Container, Image, Header } from "semantic-ui-react";
import FollowerStatus from "./status/followerstatus";
import Post from "./posts/post";
import "./main.css";
import { SERVER_ADDRESS } from "../constants";

class MainPage extends Component {
  componentDidMount() {
    this.checkAuthentication();
  }

  async checkAuthentication() {
    try {
      const response = await fetch(SERVER_ADDRESS + "/self", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        this.props.navigation("/login");
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
    }
  }
  render() {
    return (
      <Container fluid className="main-container">
        <div className="topbar-main">
          <Header as="h1">RiceBook</Header>
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Rice_Owls_logo.svg/800px-Rice_Owls_logo.svg.png"
            height={100}
            width={100}
          />
        </div>
        <div className="content">
          <div className="sidebar">
            <div className="mini-profile">
              <MiniProfile />
            </div>
            <div className="status-update">
              <h2>Status Update</h2>
              <StatusUpdate />
            </div>
            <div className="follower-status">
              <FollowerStatus />
            </div>
          </div>
          <div className="posts">
            <Post />
          </div>
        </div>
      </Container>
    );
  }
}

export default MainPage;

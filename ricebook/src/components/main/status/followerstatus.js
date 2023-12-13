import React, { Component } from "react";
import "./followerstatus.css";
import axios from "axios";
import { SERVER_ADDRESS } from "../../constants";

class FollowerStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followers: [],
      newFollowerName: "",
      errorMessage: "",
    };
  }
  componentDidMount() {
    this.getFollowers();
  }

  getFollowers = async () => {
    try {
      const response = await axios.get(SERVER_ADDRESS + "/following", {
        withCredentials: true,
      });

      const { following, result } = response.data;

      if (result === "success") {
        console.log("here");
        const followersWithUsernames = await Promise.all(
          following.map(async (follower) => {
            const avatarResponse = await axios.get(
              SERVER_ADDRESS + `/avatar/${follower.username}`,
              {
                withCredentials: true,
              }
            );

            const headlineResponse = await axios.get(
              SERVER_ADDRESS + `/headline/${follower.username}`,
              {
                withCredentials: true,
              }
            );

            return {
              id: follower._id,
              username: follower.username,
              avatar: avatarResponse.data.avatar,
              headline: headlineResponse.data.headline,
            };
          })
        );

        console.log(followersWithUsernames);
        this.setState({
          followers: followersWithUsernames,
        });
      }
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  handleUnfollow = async (id) => {
    const { followers } = this.state;
    const userToUnfollow = followers.find((follower) => follower.id === id);
    if (userToUnfollow) {
      try {
        await axios.delete(
          SERVER_ADDRESS + `/following/${userToUnfollow.username}`,
          {
            withCredentials: true,
          }
        );

        this.setState((prevState) => ({
          followers: prevState.followers.filter(
            (follower) => follower.id !== id
          ),
        }));
      } catch (error) {
        console.error("Error unfollowing:", error);
      }
    }
  };

  handleFollow = async () => {
    const { newFollowerName, followers } = this.state;

    if (newFollowerName.trim() !== "") {
      const isAlreadyFollowed = followers.some(
        (follower) => follower.username === newFollowerName
      );

      if (isAlreadyFollowed) {
        this.setState({
          errorMessage: "User is already followed.",
        });
        return;
      }

      try {
        const response = await axios.put(
          SERVER_ADDRESS + `/following/${newFollowerName}`,
          {},
          {
            withCredentials: true,
          }
        );

        const { following, result } = response.data;

        if (result === "success") {
          const followersWithUsernames = following.map((follower) => ({
            id: follower._id,
            username: follower.username,
          }));
          this.setState({
            followers: followersWithUsernames,
            newFollowerName: "",
            errorMessage: "",
          });
        }

        this.getFollowers();
      } catch (error) {
        console.error("Error following:", error);

        this.setState({
          errorMessage: "User Not Found.",
        });
      }
    }
  };

  handleChange = (e) => {
    this.setState({ newFollowerName: e.target.value });
  };

  render() {
    const { followers, errorMessage } = this.state;
    return (
      <div className="follower-status">
        <h3>Your Followers</h3>
        {followers.map((follower) => (
          <div key={follower.id} className="follower-card">
            <img
              src={follower.avatar}
              alt={`Avatar of ${follower.id}`}
              height={100}
              width={100}
            />
            <div className="info">
              <div className="username">{follower.username}</div>
              <div className="catchphrase">{follower.headline}</div>
              <button onClick={() => this.handleUnfollow(follower.id)}>
                Unfollow
              </button>
            </div>
          </div>
        ))}
        <div className="add-follower">
          <input
            type="text"
            value={this.state.newFollowerName}
            onChange={this.handleChange}
            placeholder="Enter username"
          />
          <button onClick={this.handleFollow}>Follow</button>
          <br></br>
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    );
  }
}

export default FollowerStatus;

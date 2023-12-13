import React, { Component } from "react";
import { Form, Button } from "semantic-ui-react";
import "./statusupdate.css";
import { SERVER_ADDRESS } from "../../constants";

class StatusUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      displayStatus: "",
    };
    this.fetchHeadline = this.fetchHeadline.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    this.fetchHeadline();
  }
  fetchHeadline = async () => {
    try {
      const response = await fetch(SERVER_ADDRESS + "/headline", {
        method: "GET",
        credentials: "include",
      });
      console.log(response);

      if (response.ok) {
        const userData = await response.json();
        this.setState({
          username: userData.username,
          displayStatus: userData.headline,
        });
      }
    } catch (error) {
      console.error("Error fetching headline:", error);
    }
  };

  handleChange = (e) => {
    this.setState({
      status: e.target.value,
    });
  };

  handleUpdate = async () => {
    try {
      const updatedHeadline = { headline: this.state.status };
      const response = await fetch(SERVER_ADDRESS + "/headline", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedHeadline),
        credentials: "include",
      });
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        this.setState({
          displayStatus: data.headline,
        });

        localStorage.setItem("status", data.headline);
      }
    } catch (error) {
      console.error("Error updating headline:", error);
    }
  };

  render() {
    const { displayStatus } = this.state;

    return (
      <div className="status-update-container">
        <Form>
          <Form.Field>
            <input
              type="text"
              className="input-field"
              placeholder="Update your status..."
              onChange={this.handleChange}
            />
          </Form.Field>
          <Button className="submit-button" onClick={this.handleUpdate}>
            Update
          </Button>
        </Form>
        <div className="text-box">
          <p>{displayStatus}</p>
        </div>
      </div>
    );
  }
}

export default StatusUpdate;

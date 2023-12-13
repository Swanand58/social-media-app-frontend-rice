import React, { Component } from "react";
import "./post.css";
import axios from "axios";
import { SERVER_ADDRESS } from "../../constants";

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      text: "",
      comments: [],
      newCommentText: "",
      errorMessage: "",
    };
    this.getPostDetails = this.getPostDetails.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.editPost = this.editPost.bind(this);
  }

  componentDidMount() {
    this.getPostDetails();
  }

  getPostDetails = async () => {
    const postId = this.props.activePostId;

    try {
      const response = await axios.get(SERVER_ADDRESS + `/articles/${postId}`, {
        withCredentials: true,
      });

      const { title, text } = response.data.article;

      this.setState({
        title,
        text,
      });
    } catch (error) {
      console.error("Error fetching post details:", error.message);
    }
  };

  editPost = async (e) => {
    e.preventDefault();
    const { activePostId } = this.props;
    const { title, text } = this.state;

    try {
      const response = await axios.put(
        SERVER_ADDRESS + `/articles/${activePostId}`,
        {
          title,
          text,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(response);
      const { status, data } = response;

      if (status === 200) {
        this.setState({ title: data.title, text: data.text });
        this.getPostDetails();
      }

      if (status === 401) {
        this.setState({
          errorMessage: "Unauthorized. You cannot edit this post",
        });
      } else {
        console.error("Error in response for update article");
      }
    } catch (error) {
      this.setState({
        errorMessage: "Unauthorized. You cannot edit this post",
      });
      console.error("Error editing post:", error.message);
    }
  };

  handleTextChange = (e) => {
    this.setState({ text: e.target.value });
  };

  handleTitleChange = (e) => {
    this.setState({ title: e.target.value });
  };

  render() {
    const { onClose } = this.props;
    const { title, text } = this.state;

    return (
      <div className="edit-popup">
        <div className="edit-container">
          <button className="edit-close" onClick={onClose}>
            Close
          </button>
          <h3 className="edit-heading">Edit Post</h3>
          <form className="edit-form">
            <label className="edit-label">Title:</label>
            <input
              className="edit-input"
              type="text"
              value={title}
              onChange={this.handleTitleChange}
            />
            <label className="edit-label">Text:</label>
            <textarea
              className="edit-textarea"
              value={text}
              onChange={this.handleTextChange}
            ></textarea>
            <button
              className="edit-submit"
              type="submit"
              onClick={this.editPost}
            >
              Update Post
            </button>
          </form>
          {this.state.errorMessage && (
            <p className="error-message">{this.state.errorMessage}</p>
          )}
        </div>
      </div>
    );
  }
}

export default Edit;

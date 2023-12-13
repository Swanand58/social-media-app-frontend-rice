import React from "react";
import "./post.css";
import axios from "axios";
import { SERVER_ADDRESS } from "../../constants";

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      newCommentText: "",
      editingCommentId: null,
      updatedCommentText: "",
      errorMessage: "",
    };
    this.getComments = this.getComments.bind(this);
  }

  componentDidMount() {
    this.getComments();
  }

  getComments = async () => {
    const postId = this.props.activePostId;

    const response = await axios.get(SERVER_ADDRESS + `/articles/${postId}`, {
      withCredentials: true,
    });

    // console.log(response.data.article.comments[1].comment);
    const { result } = response.data;
    const articleComments = response.data.article.comments;
    if (result === "success") {
      this.setState({ comments: articleComments });
    }
  };

  addNewComment = async () => {
    const { activePostId } = this.props;
    const { newCommentText } = this.state;
    this.getComments();

    if (!newCommentText.trim()) {
      // Ignore empty comments
      return;
    }

    try {
      const response = await axios.put(
        SERVER_ADDRESS + `/articles/${activePostId}`,
        {
          text: newCommentText,
          commentId: -1,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const { username, article } = response.data;

      if (article) {
        const newComment = {
          username,
          comment: newCommentText,
        };

        this.setState((prevState) => ({
          comments: [newComment, ...prevState.comments],
          newCommentText: "",
        }));
      }
      console.log(this.state.comments, "Adding in add comment");
    } catch (error) {
      console.error("Error adding a new comment:", error.message);
    }
  };

  startEditingComment = (commentId, currentText) => {
    this.setState({
      editingCommentId: commentId,
      updatedCommentText: currentText,
    });
  };

  //update comment api call

  updateComment = async (commentId) => {
    const { activePostId } = this.props;
    const { updatedCommentText } = this.state;

    try {
      await axios.put(
        SERVER_ADDRESS + `/articles/${activePostId}`,
        {
          text: updatedCommentText,
          commentId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      this.setState((prevState) => ({
        comments: prevState.comments.map((comment) =>
          comment._id === commentId
            ? { ...comment, comment: updatedCommentText }
            : comment
        ),
        editingCommentId: null,
        updatedCommentText: "",
        errorMessage: "",
      }));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const errorMessage =
          "Unauthorized: You don't own this comment, Update Failed.";
        console.error(errorMessage);
        this.setState({ errorMessage });
      } else {
        const errorMessage = `Error updating comment: ${error.message}`;
        console.error(errorMessage);
        this.setState({ errorMessage });
      }
    }
  };

  render() {
    const { onClose } = this.props;
    const {
      newCommentText,
      comments,
      editingCommentId,
      updatedCommentText,
      errorMessage,
    } = this.state;

    return (
      <div className="comment-popup">
        <div className="comment-container">
          <button className="comment-close" onClick={onClose}>
            Close
          </button>
          <h3 className="comment-heading">Comments</h3>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <ul className="comment-list">
            {comments.length > 0 ? (
              <ul className="comment-list">
                {comments.map((comment) => (
                  <li key={comment._id} className="comment-list-item">
                    {editingCommentId === comment._id ? (
                      <>
                        <input
                          type="text"
                          value={updatedCommentText}
                          onChange={(e) =>
                            this.setState({
                              updatedCommentText: e.target.value,
                            })
                          }
                        />
                        <button onClick={() => this.updateComment(comment._id)}>
                          Update Comment
                        </button>
                      </>
                    ) : (
                      <>
                        <p>
                          {comment.username}: {comment.comment}
                        </p>
                        <button
                          onClick={() =>
                            this.startEditingComment(
                              comment._id,
                              comment.comment
                            )
                          }
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No comments available.</p>
            )}
          </ul>
          <div className="add-comment-container">
            <input
              className="comment-input"
              type="text"
              value={newCommentText}
              onChange={(e) =>
                this.setState({ newCommentText: e.target.value })
              }
              placeholder="Add a new comment..."
            />
            <button className="comment-submit" onClick={this.addNewComment}>
              Add Comment
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Comment;

import React, { Component } from "react";
import "./post.css";
import { Container } from "semantic-ui-react";
import Comment from "./comments";
import Edit from "./edit";
import axios from "axios";
import { SERVER_ADDRESS } from "../../constants";

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      postImage: null,
      postTitle: "",
      postText: "",
      searchQuery: "",
      filteredPost: [],
      isCommentPopupOpen: false,
      isEditPopupOpen: false,
      activePostId: null,
      currentPage: 1,
      postsPerPage: 10,
    };
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.addNewPost = this.addNewPost.bind(this);
    this.getPosts = this.getPosts.bind(this);
    // this.handleEdit = this.handleEdit.bind(this);
  }
  componentDidMount() {
    this.getPosts();
  }

  getPosts = async () => {
    try {
      const response = await axios.get(SERVER_ADDRESS + "/articles", {
        withCredentials: true,
      });
      const { articles, result } = response.data;
      if (result === "success") {
        this.setState({ posts: articles });
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  };

  handleComment = (postId) => {
    this.setState({ isCommentPopupOpen: true, activePostId: postId });
  };

  handleEdit = (postId) => {
    this.setState({ isEditPopupOpen: true, activePostId: postId });
  };

  handleCloseCommentPopup = () => {
    this.setState({ isCommentPopupOpen: false });
  };

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  generateTimestamp = (index) => {
    const now = new Date();
    const timestamp = new Date(now.getTime() - index * 86400000);
    return timestamp.toLocaleString();
  };

  addNewPost = async () => {
    try {
      const { postTitle, postText, postImage } = this.state;
      if (!postText.trim()) {
        return;
      }

      const formData = new FormData();
      formData.append("title", postTitle);
      formData.append("text", postText);

      if (postImage) {
        formData.append("image", postImage);
      }

      for (var pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      const response = await fetch(SERVER_ADDRESS + "/articles", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const { article } = await response.json();

      if (response.ok && article) {
        const newPost = {
          _id: article._id,
          author: article.author,
          title: article.title,
          text: article.text,
          image: article.image,
          createdAt: article.createdAt,
        };

        this.setState((prevState) => ({
          posts: [newPost, ...prevState.posts],
          postText: "",
          postTitle: "",
          postImage: null,
        }));
      }

      this.getPosts();
    } catch (error) {
      console.error("Error creating a new post:", error.message);
    }
  };

  handleCancelPost = () => {
    this.setState({ postTitle: "", postText: "", postImage: null });
  };

  handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.setState({
        postImage: file,
      });
    };
    reader.readAsDataURL(file);
  };

  handleTextChange = (e) => {
    this.setState({ postText: e.target.value });
  };
  handleTitleChange = (e) => {
    this.setState({ postTitle: e.target.value });
  };

  handleSearch = () => {
    const { searchQuery, posts } = this.state;

    const filteredPost = posts.filter((post) => {
      const { text, title } = post;

      return (
        text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    this.setState({ filteredPost });

    localStorage.setItem("filteredPostCount", filteredPost.length.toString());
  };

  render() {
    const {
      posts,
      filteredPost,
      searchQuery,
      currentPage,
      postsPerPage,
      isCommentPopupOpen,
      isEditPopupOpen,
    } = this.state;

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    return (
      <Container className="post-grid">
        <div className="search">
          <input
            type="text"
            data-testid="search-input"
            value={searchQuery}
            onChange={(e) => this.setState({ searchQuery: e.target.value })}
            placeholder="Search by text or author"
          />
          <button onClick={this.handleSearch}>Search</button>
        </div>
        <div className="post-container">
          {filteredPost.length > 0
            ? filteredPost.map((post) => (
                <div data-testid="post" key={post._id} className="posts">
                  <img src={post.image} alt={`Post ${post._id}`} />
                  <p className="author">Author: {post.author}</p>
                  <p className="title">{post.title}</p>
                  <p className="body">{post.text}</p>
                  <p className="timestamp">{post.createdAt}</p>
                  <div className="buttons">
                    <button onClick={() => this.handleEdit(post._id)}>
                      Edit
                    </button>
                    <button onClick={() => this.handleComment(post._id)}>
                      Comment
                    </button>
                  </div>
                </div>
              ))
            : currentPosts.map((post) => (
                <div key={post._id} className="posts">
                  <img
                    src={post.image}
                    height={300}
                    width={300}
                    alt={`Post ${post._id}`}
                  />
                  <p className="author">Author: {post.author}</p>
                  <p className="title">{post.title}</p>
                  <p className="body">{post.text}</p>
                  <p className="timestamp">{post.createdAt}</p>
                  <div className="buttons">
                    <button onClick={() => this.handleEdit(post._id)}>
                      Edit
                    </button>
                    <button onClick={() => this.handleComment(post._id)}>
                      Comment
                    </button>
                  </div>
                </div>
              ))}
          {isCommentPopupOpen && (
            <Comment
              onClose={this.handleCloseCommentPopup}
              activePostId={this.state.activePostId}
            />
          )}
          {isEditPopupOpen && (
            <Edit
              onClose={() => this.setState({ isEditPopupOpen: false })}
              activePostId={this.state.activePostId}
            />
          )}
        </div>
        <div className="pagination">
          {Array.from({ length: Math.ceil(posts.length / postsPerPage) }).map(
            (item, index) => (
              <button
                key={index}
                onClick={() => this.handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
        <div className="new-post">
          <textarea
            value={this.state.postTitle}
            onChange={this.handleTitleChange}
            placeholder="Write a new post Title..."
          />
          <textarea
            value={this.state.postText}
            onChange={this.handleTextChange}
            placeholder="Write a new post..."
          />
          <input
            type="file"
            accept="image/*"
            onChange={this.handleImageUpload}
          />
          <button onClick={this.addNewPost}>Post</button>
          <button onClick={this.handleCancelPost}>Cancel</button>
        </div>
      </Container>
    );
  }
}

export default Post;

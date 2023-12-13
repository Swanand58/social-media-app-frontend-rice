import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Post from "./post";

describe("Posts tests", () => {
  const registeredUser = {
    id: 1,
    name: "Leanne Graham",
    username: "Bret",
    email: "Sincere@april.biz",
    address: {
      street: "Kulas Light",
      suite: "Apt. 556",
      city: "Gwenborough",
      zipcode: "92998-3874",
      geo: {
        lat: "-37.3159",
        lng: "81.1496",
      },
    },
    phone: "1-770-736-8031 x56442",
    website: "hildegard.org",
    company: {
      name: "Romaguera-Crona",
      catchPhrase: "Multi-layered client-server neural-net",
      bs: "harness real-time e-markets",
    },
  };
  sessionStorage.setItem("userData", JSON.stringify(registeredUser));

  render(
    <Router>
      <Post />
    </Router>
  );

  const searchInput = screen.queryByTestId("search_input");

  test("should fetch all articles for current logged in user (posts state is set)", async () => {
    setTimeout(() => {
      const posts = sessionStorage.getItem("currentUserPostsCount");
      expect(posts).toBe(10);
    }, 50);
  });

  test("Post search is working", async () => {
    setTimeout(() => {
      const filteredPosts = localStorage.getItem("filteredPostCount");

      fireEvent.change(searchInput, {
        target: {
          value: "quia",
        },
      });

      expect(filteredPosts).toBe(3);
    }, 50);
  });

  test("should add articles when adding a follower (posts state is larger)", async () => {
    setTimeout(() => {
      const posts = sessionStorage.getItem("combinedUserPostCount");
      expect(posts).toBetoBeGreaterThan(40);
    }, 50);
  });

  test("should remove articles when removing a follower (posts state is smaller)", () => {
    setTimeout(() => {
      const posts = sessionStorage.getItem("combinedUserPostCount");
      expect(posts).toBe(40);
    }, 50);
  });
});

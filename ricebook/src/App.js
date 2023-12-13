import "./App.css";
import Auth from "./components/auth/auth";
import MainPage from "./components/main/main";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Profile from "./components/profile/profile";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Auth />} />
          <Route exact path="/main" element={<MainPage />} />
          <Route exact path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

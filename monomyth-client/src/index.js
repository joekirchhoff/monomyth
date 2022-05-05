import { useState, useEffect } from "react";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import GlobalStyle from "./styles/globalStyle";
import theme from "./styles/theme";

import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import CreateStoryPage from "./routes/CreateStoryPage";
import Home from "./routes/Home";
import LogInPage from "./routes/LogInPage";
import SignUpPage from "./routes/SignUpPage";
import StoryPage from "./routes/StoryPage";
import UserPage from "./routes/UserPage";
import UpdateUserPage from "./routes/UpdateUserPage";
import EditStoryPage from "./routes/EditStoryPage";
import SearchPage from "./routes/SearchPage";

const App = () => {

  // Current User state context
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user session from API
  const getCurrentUser = () => {
    fetch('http://localhost:8080/api/users/session', {
      method: "GET",
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
    .then(res => {
      return res.json();
    })
    .then(res => {
      if (res.message) setCurrentUser(res.message);
    });
  }

  useEffect(() => {
    getCurrentUser();
  }, [])

  return (
    <BrowserRouter forceRefresh={true}>
      <ThemeProvider theme={theme} >
        <GlobalStyle />
        <NavBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
        <Routes>
          <Route index element={<Home currentUser={currentUser} />} />
          <Route path={'/story/:storyID'} element={<StoryPage currentUser={currentUser} />} />
          <Route path={'/story/:storyID/edit'} element={<EditStoryPage currentUser={currentUser} />} />
          <Route path={'/user/:userID'} element={<UserPage currentUser={currentUser} />} />
          <Route path={'/user/:userID/update'} element={<UpdateUserPage currentUser={currentUser} />} />
          <Route path={'/create'} element={<CreateStoryPage />} />
          <Route path={'/signup'} element={<SignUpPage />} />
          <Route path={'/login'} element={<LogInPage />} />
          <Route path={'/search'} element={<SearchPage currentUser={currentUser} />} />
        </Routes>
        <Footer />
      </ThemeProvider>
    </BrowserRouter>
  )
}

render(
  <App />,
  document.getElementById("root")
);
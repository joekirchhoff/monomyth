import { useState, useEffect } from "react";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createGlobalStyle } from 'styled-components'
import Footer from "./components/Footer";

import NavBar from "./components/NavBar";
import CreateStoryPage from "./routes/CreateStoryPage";
import Home from "./routes/Home";
import LogInPage from "./routes/LogInPage";
import SignUpPage from "./routes/SignUpPage";
import StoryPage from "./routes/StoryPage";
import UserPage from "./routes/UserPage";
import UpdateUserPage from "./routes/UpdateUserPage";

// Global CSS reset
const GlobalStyle = createGlobalStyle`
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  *, *::before, *::after {
    box-sizing: border-box;
  }
  body {
    background-color: #111;
  }
  #root { // Keeps the footer to bottom of page without "position: fixed"; all page containers have "flex: 1"
    min-height: 100vh;
    display: flex;
    flex-flow: column nowrap;
  }
`

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
    <BrowserRouter>
      <GlobalStyle />
      <NavBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Routes>
        <Route index element={<Home currentUser={currentUser} />} />
        <Route path={'/story/:storyID'} element={<StoryPage currentUser={currentUser} />} />
        <Route path={'/user/:userID'} element={<UserPage currentUser={currentUser} />} />
        <Route path={'/user/:userID/update'} element={<UpdateUserPage currentUser={currentUser} />} />
        <Route path={'/create'} element={<CreateStoryPage />} />
        <Route path={'/signup'} element={<SignUpPage />} />
        <Route path={'/login'} element={<LogInPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

render(
  <App />,
  document.getElementById("root")
);
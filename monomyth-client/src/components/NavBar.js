import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: #222;
  color: white;
  font-size: 1rem;
  padding: 1rem;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 10;
`

// SEARCH BAR ===================================
const SearchContainer = styled.div`

`

const SearchBar = styled.input`

`

const SearchBtn = styled.button`

`

// MENU BUTTONS =================================
const MenuContainer = styled.div`

`

const MobileMenuBtn = styled.button`
  @media (min-width: 768px) {
    display: none;
  }
`

const MobileMenu = styled.div`
  display: flex;
  flex-flow: column nowrap;
  background-color: tomato;
  padding: 1rem;
  position: fixed;
  top: 3rem;
  right: 0;
  @media (min-width: 768px) {
      display: none;
    }
`
const DesktopMenu = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`

const LinkBtn = styled(Link)`
  border: none;
  padding: 1rem;
  margin: 0 .5rem;
  background-color: lightseagreen;
  text-decoration: none;
  color: white;
  font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 1rem;
`

const LogoutBtn = styled.button`
  border: none;
  padding: 1rem;
  margin: 0 .5rem;
  background-color: lightseagreen;
  text-decoration: none;
  color: white;
  cursor: pointer;
  font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 1rem;
`

// ==============================================

function NavBar(props) {

  // Logout handler
  const logoutBtnHandler = () => {
    fetch('http://localhost:8080/api/users/session', {
      method: "DELETE",
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
    .then(res => {
      return res.json();
    })
    .then(res => {
      if (res.message) {
        props.setCurrentUser(null);
        window.location.reload();
      }
    });
  }
  
  // Mobile hamburger menu
  const [menuOpen, setMenuOpen] = useState(false)

  const handleMenuBtn = () => {
    setMenuOpen(prev => !prev);
  }

  return (
    <Nav>
      <Link to='/'>Home Logo</Link>
      <SearchContainer>
        <SearchBar type='text' placeholder='Search' />
        <SearchBtn >🔍</SearchBtn>
      </SearchContainer>
      { (props.currentUser) ?
        // User logged in; show logout and profile buttons
        <MenuContainer>
          <DesktopMenu>
            <LogoutBtn onClick={logoutBtnHandler}>Log out</LogoutBtn>
            <LinkBtn to={`/user/${props.currentUser._id}`}>{props.currentUser.username}</LinkBtn>
            <LinkBtn to='/create'>Create</LinkBtn>
          </DesktopMenu>
          <MobileMenuBtn onClick={handleMenuBtn}>=</MobileMenuBtn>
          {menuOpen ?
            <MobileMenu>
              <LogoutBtn onClick={logoutBtnHandler}>Log out</LogoutBtn>
              <LinkBtn to={`/user/${props.currentUser._id}`}>{props.currentUser.username}</LinkBtn>
              <LinkBtn to='/create'>Create</LinkBtn>
            </MobileMenu>
            : null}
        </MenuContainer>
        : // User not logged in; show login and signup buttons; create button redirects to login page
        <MenuContainer>
          <DesktopMenu>
            <LinkBtn to='/login'>Log in</LinkBtn>
            <LinkBtn to='/signup'>Sign up</LinkBtn>
            <LinkBtn to='/login'>Create</LinkBtn>
          </DesktopMenu>
          <MobileMenuBtn onClick={handleMenuBtn}>=</MobileMenuBtn>
          {menuOpen ?
            <MobileMenu>
              <LinkBtn to='/login'>Log in</LinkBtn>
              <LinkBtn to='/signup'>Sign up</LinkBtn>
              <LinkBtn to='/login'>Create</LinkBtn>
            </MobileMenu>
            : null}
        </MenuContainer>
      }
    </Nav>
  );
}

export default NavBar;

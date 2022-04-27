import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SearchBar from './SearchBar';

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
  height: 3rem;
`

// LOGO =========================================
const LogoContainer = styled.div`
  flex: 1;
`

// SEARCH BAR ===================================
const SearchContainer = styled.div`
  flex: 1;
`

// MENU BUTTONS =================================
const MenuContainer = styled.div`
  flex: 1;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
`

const MobileMenuBtn = styled.button`
  border: none;
  background-color: #222;
  color: white;
  font-size: 2rem;
  line-height: 1rem;
  cursor: pointer;
  @media (min-width: 768px) {
    display: none;
  }
`

const MobileMenu = styled.div`
  border: gray solid 2px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  background-color: #222;
  padding: 1rem;
  min-height: 10rem;
  position: fixed;
  top: 3.5rem;
  right: .5rem;
  @media (min-width: 768px) {
      display: none;
    }
`
const DesktopMenu = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`

const NavBtn = styled.button`
  border: none;
  background-color: ${props => props.specialBtn ? '#eee' : '#222'};
  color: ${props => props.specialBtn ? '#000' : 'white'};
  border-radius: ${props => props.specialBtn ? '50rem' : 'none'};
  padding: .5rem 1rem;
  margin: 0 .5rem;
  text-decoration: none;
  font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 1rem;
  cursor: pointer;
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

  const closeMenu = () => {
    setMenuOpen(false);
  }

  return (
    <Nav>
      <LogoContainer>
        <Link to='/'>Home Logo</Link>
      </LogoContainer>
      <SearchContainer>
        <SearchBar />
      </SearchContainer>
      { (props.currentUser) ?
        // User logged in; show logout and profile buttons
        <MenuContainer>
          <DesktopMenu>
            <NavBtn onClick={logoutBtnHandler}>Log out</NavBtn>
            <Link to={`/user/${props.currentUser._id}`}>
              <NavBtn onClick={closeMenu}>{props.currentUser.username}</NavBtn>
            </Link>
            <Link to='/create'>
              <NavBtn specialBtn onClick={closeMenu}>Create</NavBtn>
            </Link>
          </DesktopMenu>
          <MobileMenuBtn onClick={handleMenuBtn}>☰</MobileMenuBtn>
          {menuOpen ?
            <MobileMenu>
              <NavBtn onClick={logoutBtnHandler}>Log out</NavBtn>
              <Link to={`/user/${props.currentUser._id}`}>
                <NavBtn onClick={closeMenu}>{props.currentUser.username}</NavBtn>
              </Link>
              <Link to='/create'>
                <NavBtn specialBtn onClick={closeMenu}>Create</NavBtn>
              </Link>
            </MobileMenu>
            : null}
        </MenuContainer>
        : // User not logged in; show login and signup buttons; create button redirects to login page
        <MenuContainer>
          <DesktopMenu>
            <Link to='/login'>
              <NavBtn onClick={closeMenu}>Log in</NavBtn>
            </Link>
            <Link to='/signup'>
              <NavBtn onClick={closeMenu}>Sign up</NavBtn>
            </Link>
            <Link to='/login'>
              <NavBtn specialBtn onClick={closeMenu}>Create</NavBtn>
            </Link>
          </DesktopMenu>
          <MobileMenuBtn onClick={handleMenuBtn}>☰</MobileMenuBtn>
          {menuOpen ?
            <MobileMenu>
              <Link to='/login'>
                <NavBtn onClick={closeMenu}>Log in</NavBtn>
              </Link>
              <Link to='/signup'>
                <NavBtn onClick={closeMenu}>Sign up</NavBtn>
              </Link>
              <Link to='/login'>
                <NavBtn specialBtn onClick={closeMenu}>Create</NavBtn>
              </Link>
            </MobileMenu>
            : null}
        </MenuContainer>
      }
    </Nav>
  );
}

export default NavBar;

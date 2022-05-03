import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import LogoLink from './LogoLink';
import SearchBar from './SearchBar';

const Nav = styled.nav`
  background-color: #222;
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
  box-shadow:
    .25rem .5rem 1rem rgba(0, 0, 0, 0.3),
    0 0 1.5rem rgba(0, 0, 0, .2);
`

// LOGO =========================================
const LogoContainer = styled.div`
  flex: 1;
`

// SEARCH BAR ===================================
const SearchContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
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
  color: #eee;
  font-size: 2rem;
  line-height: 1rem;
  cursor: pointer;
  @media (min-width: 947px) {
    display: none;
  }
`

const MobileMenuList = styled.ul`
  list-style: none;
  border: gray solid 1px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  background-color: #222;
  padding: 1rem;
  min-height: 10rem;
  position: fixed;
  top: 3.5rem;
  right: .5rem;
  @media (min-width: 947px) {
      display: none;
    }
`
const DesktopMenuList = styled.ul`
  list-style: none;
  display: flex;
  @media (max-width: 947px) {
    display: none;
  }
`

const NavBtn = styled.button`
  border: none;
  background-color: ${props => props.specialBtn ? '#eee' : '#222'};
  color: ${props => props.specialBtn ? '#111' : '#eee'};
  border-radius: ${props => props.specialBtn ? '50rem' : 'none'};
  padding: .5rem 1rem;
  margin: 0 .5rem;
  text-decoration: none;
  font-size: 1rem;
  cursor: pointer;
  min-width: 6rem;
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
        <LogoLink />
      </LogoContainer>
      <SearchContainer>
        <SearchBar />
      </SearchContainer>
      { (props.currentUser) ?
        // User logged in; show logout and profile buttons
        <MenuContainer>
          <DesktopMenuList>
            <li>
              <NavBtn onClick={logoutBtnHandler}>Log out</NavBtn>
            </li>
            <li>
              <Link to={`/user/${props.currentUser._id}`}>
                <NavBtn onClick={closeMenu}>{props.currentUser.username}</NavBtn>
              </Link>
            </li>
            <li>
              <Link to='/create'>
                <NavBtn specialBtn onClick={closeMenu}>Create</NavBtn>
              </Link>
            </li>
          </DesktopMenuList>
          <MobileMenuBtn onClick={handleMenuBtn}>☰</MobileMenuBtn>
          {menuOpen ?
            <MobileMenuList>
              <li>
                <NavBtn onClick={logoutBtnHandler}>Log out</NavBtn>
              </li>
              <li>
                <Link to={`/user/${props.currentUser._id}`}>
                  <NavBtn onClick={closeMenu}>{props.currentUser.username}</NavBtn>
                </Link>
              </li>
              <li>
                <Link to='/create'>
                  <NavBtn specialBtn onClick={closeMenu}>Create</NavBtn>
                </Link>
              </li>
            </MobileMenuList>
            : null}
        </MenuContainer>
        : // User not logged in; show login and signup buttons; create button redirects to login page
        <MenuContainer>
          <DesktopMenuList>
            <li>
              <Link to='/login'>
                <NavBtn onClick={closeMenu}>Log in</NavBtn>
              </Link>
            </li>
            <li>
              <Link to='/signup'>
                <NavBtn onClick={closeMenu}>Sign up</NavBtn>
              </Link>
            </li>
            <li>
              <Link to='/login'>
                <NavBtn specialBtn onClick={closeMenu}>Create</NavBtn>
              </Link>
            </li>
          </DesktopMenuList>
          <MobileMenuBtn onClick={handleMenuBtn}>☰</MobileMenuBtn>
          {menuOpen ?
            <MobileMenuList>
              <li>
                <Link to='/login'>
                  <NavBtn onClick={closeMenu}>Log in</NavBtn>
                </Link>
              </li>
              <li>
                <Link to='/signup'>
                  <NavBtn onClick={closeMenu}>Sign up</NavBtn>
                </Link>
              </li>
              <li>
                <Link to='/login'>
                  <NavBtn specialBtn onClick={closeMenu}>Create</NavBtn>
                </Link>
              </li>
            </MobileMenuList>
            : null}
        </MenuContainer>
      }
    </Nav>
  );
}

export default NavBar;

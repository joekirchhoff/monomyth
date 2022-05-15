import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import LogoLink from './LogoLink';
import SearchBar from './SearchBar';
import MobileMenuBtn from './MobileMenuBtn';

const Nav = styled.nav`
  background-color: ${props => props.theme.bgMainColor};
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
  box-shadow: ${props => props.theme.boxShadowMain};
`

const LogoContainer = styled.div`
  flex: 1;
`

const SearchContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`

const MenuContainer = styled.div`
  flex: 1;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
`

const MobileMenuList = styled.ul`
  list-style: none;
  border: ${props => props.theme.borderMain};
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  background-color: ${props => props.theme.bgMainColor};
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
  background-color: ${props => props.specialBtn ? props.theme.btnPrimaryBgColor : 'transparent'};
  color: ${props => props.specialBtn ? props.theme.btnPrimaryTextColor : props.theme.textMainColor};
  border-radius: ${props => props.specialBtn ? '50rem' : 'none'};
  padding: .5rem 1rem;
  margin: 0 .5rem;
  font-size: 1rem;
  cursor: pointer;
  min-width: 6rem;
`

function NavBar(props) {

  // Logout handler
  const logoutBtnHandler = () => {
    fetch('https://monomyth.herokuapp.com/api/users/session', {
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

  // Store ref to mobile menu to handle focus (closes on clicking anywhere outside)
  const mobileMenu = useRef();

  // Focus mobile menu when open
  useEffect(() => {
    if (menuOpen) mobileMenu.current.focus();
  }, [menuOpen])
  
  // When mobile menu loses focus, check if new focus target is a child of mobile menu;
  // if not, close mobile menu
  const onMobileMenuBlur = (e) => {
    if (!mobileMenu.current.contains(e.relatedTarget)) {
      setMenuOpen(false);
    }
  }
  
  const handleMenuBtn = () => {
    setMenuOpen(!menuOpen);
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
          <MobileMenuBtn handleMenuBtn={handleMenuBtn} menuOpen={menuOpen} />
          {menuOpen ?
            <MobileMenuList ref={mobileMenu} onBlur={onMobileMenuBlur} tabIndex='0'>
              <li>
                <NavBtn onClick={logoutBtnHandler} tabIndex='0'>Log out</NavBtn>
              </li>
              <li>
                <Link to={`/user/${props.currentUser._id}`}>
                  <NavBtn onClick={closeMenu} tabIndex='0'>{props.currentUser.username}</NavBtn>
                </Link>
              </li>
              <li>
                <Link to='/create'>
                  <NavBtn specialBtn onClick={closeMenu} tabIndex='0'>Create</NavBtn>
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
          <MobileMenuBtn handleMenuBtn={handleMenuBtn} menuOpen={menuOpen} />
          {menuOpen ?
            <MobileMenuList ref={mobileMenu} onBlur={onMobileMenuBlur} tabIndex='0' >
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

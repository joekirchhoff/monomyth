import styled from "styled-components";

const MenuBtn = styled.button`
  border: none;
  background-color: transparent;
  color: ${props => props.theme.textMainColor};
  font-size: 2rem;
  line-height: 1rem;
  cursor: pointer;
  @media (min-width: 947px) {
    display: none;
  }
  height: 3rem;
  width: 3rem;
`

const MobileMenuBtn = (props) => {

  return (
    <MenuBtn
      onMouseDown={props.handleMenuBtn}
      aria-label={props.menuOpen ? 'close menu' : 'open menu'}
    >
      {props.menuOpen ?
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden={true} >
          <title>Close Menu</title>
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
            d="M368 368L144 144M368 144L144 368"
          />
        </svg>
        :
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden={true} >
          <title>Open Menu</title>
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeMiterlimit="10"
            strokeWidth="32"
            d="M120 160h272M120 256h272M120 352h272"
          />
        </svg>
      }
    </MenuBtn>
  )
}

export default MobileMenuBtn
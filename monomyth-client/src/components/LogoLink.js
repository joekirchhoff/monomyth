import styled from "styled-components";
import { Link } from 'react-router-dom'

const Logo = styled(Link)`
  color: ${props => props.theme.logoColor};
  font-weight: 900;
  font-size: 1.5rem;
`

const DesktopText = styled.span`
  @media (max-width: 947px) {
    display: none;
  }
`

const MobileText = styled.span`
  @media (min-width: 947px) {
    display: none;
  }
`

const LogoLink = () => {

  return (
    <Logo to='/'>
      <DesktopText>monomyth</DesktopText>
      <MobileText>mm</MobileText>
    </Logo>
  )
}

export default LogoLink
import styled from 'styled-components';

const StyledFooter = styled.footer`
  height: 2rem;
  width: 100%;
  margin-top: 3rem;
  background-color: ${props => props.theme.bgMainColor};
  margin-top: 1rem;;
  color: ${props => props.theme.textMainColor};
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  box-shadow: ${props => props.theme.boxShadowMain};
`

const Anchor = styled.a`
  color: ${props => props.theme.textLinkColor};
`

const Dot = styled.span`
  padding: 0 .5rem;
`

const Footer = () => {


  return (
    <StyledFooter>
      <span>© 2022 Joe Kirchhoff</span>
      <Dot> · </Dot>
      <Anchor target='_blank' href='#'>Portfolio</Anchor>
      <Dot> · </Dot>
      <Anchor target='_blank' href='https://github.com/joekirchhoff'>Github</Anchor>
    </StyledFooter>
  )
}

export default Footer
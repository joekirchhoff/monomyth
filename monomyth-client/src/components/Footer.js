import styled from 'styled-components';

const StyledFooter = styled.footer`
  padding: .5rem;
  width: 100%;
  margin-top: 3rem;
  background-color: #222;
  color: lightgray;
  text-align: center;
`

const Anchor = styled.a`
  color: lightblue;
`

const Dot = styled.span`
  padding: 0 .2rem;
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
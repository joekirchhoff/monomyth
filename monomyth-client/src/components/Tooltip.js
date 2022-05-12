import styled from 'styled-components';

const TooltipContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`

const TooltipText = styled.span`
  position: absolute;
  display: inline-block;
  text-align: center;
  min-width: 8rem;
  width: 15vw;
  max-width: 20rem;
  background-color: ${props => props.theme.tooltipBgColor};
  color: ${props => props.theme.tooltipTextColor};
  padding: .35rem;
  border: ${props => props.theme.borderMain};
  top: 1rem;
  z-index: 5;

  // Tooltip arrow
  ::before {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -.75rem;
    border-width: .75rem;
    border-style: solid;
    border-color: transparent transparent ${props => props.theme.tooltipBgColor} transparent;
    z-index: 5;
  }
  // Tooltip arrow outline; outline formed by second, slightly oversized arrow positioned underneath first
  ::after {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: calc(-.75rem - 1.5px);
    border-width: calc(.75rem + 1.5px);
    border-style: solid;
    border-color: transparent transparent ${props => props.theme.tooltipBorderColor} transparent;
    z-index: 4;
  }
`

const Tooltip = (props) => {

  return (
    <TooltipContainer>
      <TooltipText>{props.tooltipString}</TooltipText>
    </TooltipContainer>
    
  )
}

export default Tooltip
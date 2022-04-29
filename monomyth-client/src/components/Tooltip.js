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
  background-color: #333;
  padding: .35rem;
  border: gray solid 1px;
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
    border-color: transparent transparent #333 transparent;
    z-index: 5;
  }
  // Tooltip arrow outline
  ::after {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: calc(-.75rem - 1.5px);
    border-width: calc(.75rem + 1.5px);
    border-style: solid;
    border-color: transparent transparent gray transparent;
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
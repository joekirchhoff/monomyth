import styled from 'styled-components';
import { Link } from 'react-router-dom';

const ReceiptDimScreen = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(.5, .5, .5, .5);
  z-index: 10;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
`

const Receipt = styled.div`
  margin-top: 10rem;
  padding: 3rem;
  background-color: ${props => props.theme.bgMainColor};
  border: ${props => props.theme.borderMain};
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: ${props => props.theme.boxShadowMain};
`

const ReceiptMsg = styled.p`
  padding: 2rem;
`

const HomeLink = styled(Link)`
  color: ${props => props.theme.textLinkColor};
`

const DeleteStoryReceipt = () => {

  return (
    <ReceiptDimScreen>
      <Receipt>
        <ReceiptMsg>Story deleted successfully!</ReceiptMsg>
        <HomeLink to='/' >Return to Home</HomeLink>
      </Receipt>
    </ReceiptDimScreen>
  )
}

export default DeleteStoryReceipt
import { React } from 'react';
import styled from 'styled-components';

const Button = styled.button`
  padding: 1rem;
  width: 1rem;
  margin: auto;
  background-color: ${props => props.isLiked ? 'mediumvioletred' : 'lightgray'};
  grid-area: ${props => props.isOnComment ? '1/1/span 2/span 1' : null};
  cursor: pointer;
`

function LikeButton(props) {

  return (
    <Button onClick={props.onClick} isOnComment={props.isOnComment} isLiked={props.isLiked}>
      <p>{props.isLiked}</p>
    </Button>
  );
}

export default LikeButton;

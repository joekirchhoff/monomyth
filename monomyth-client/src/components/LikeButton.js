import { React } from 'react';
import styled from 'styled-components';
import StarSVG from './StarSVG';

const Button = styled.button`
  padding: 0;
  width: 3rem;
  height: 3rem;
  margin: auto;
  border-radius: 50%;
  border: none;
  background: ${props => props.isLiked ? props.theme.unlikeBtnStrokeColor : props.theme.likeBtnStrokeColor};
  grid-area: ${props => props.isOnComment ? '1/1/span 1/span 1' : null};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`

function LikeButton(props) {

  const ariaLabel = props.isLiked ? 'unlike' : 'like';

  return (
    <Button
      onClick={props.onClick}
      isOnComment={props.isOnComment}
      isLiked={props.isLiked}
      aria-label={ariaLabel}
    >
      <StarSVG isLiked={props.isLiked}/>
    </Button>
  );
}

export default LikeButton;

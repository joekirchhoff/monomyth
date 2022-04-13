import { React, useEffect, useState } from 'react';
import styled from 'styled-components';

const Button = styled.button`
  padding: 1rem;
  width: 1rem;
  margin: auto;
  background-color: ${props => props.isLiked ? 'blue' : 'red'}
  }
`

function LikeButton(props) {

  return (
    <Button onClick={props.onClick} isLiked={props.isLiked}>
      <p>{props.isLiked}</p>
    </Button>
  );
}

export default LikeButton;

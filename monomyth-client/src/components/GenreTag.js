import { React, useEffect, useState } from 'react';
import styled from 'styled-components';

const Tag = styled.div`
  background-color: #222;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: .25rem;
`

const Dot = styled.div`
  background-color: ${props => props.genreColor};
  border-radius: 100%;
  height: .5rem;
  width: .5rem;
  margin: .5rem;

`

const GenreName = styled.p`
  color: white;
  font-size: .8rem;
`

function GenreTag(props) {

  return (
    <Tag >
      <Dot genreColor={props.genre.color} />
      <GenreName >{props.genre.name}</GenreName>
    </Tag>
  );
}

export default GenreTag;

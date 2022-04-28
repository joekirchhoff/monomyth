import { React, useEffect, useState } from 'react';
import styled from 'styled-components';
import Tooltip from './Tooltip';

const Tag = styled.button`
  background-color: none;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: .25rem;
  background-color: #222;
  border: none;
  cursor: pointer;
  :hover {
    background-color: #333;
  }
`

const Dot = styled.div`
  background-color: ${props => props.genreColor};
  border-radius: 100%;
  height: .5rem;
  width: .5rem;
  margin: .5rem;

`

const GenreNameContainer = styled.div`
  // Needed to keep tooltip centered on text
`

const GenreName = styled.span`
  color: white;
  font-size: .8rem;
  border: none;
  background-color: transparent;
`

function GenreTag(props) {

  // Handle tooltip display state
  const [showTooltip, setShowTooltip] = useState(false);

  const onGenreClick = (e) => {
    e.preventDefault();
    setShowTooltip(!showTooltip);
  }

  return (
    <Tag onClick={onGenreClick} >
      <Dot genreColor={props.genre.color} />
      <GenreNameContainer>
        <GenreName >{props.genre.name}</GenreName>
        {(showTooltip) ? <Tooltip tooltipString={props.genre.description} /> : null }
      </GenreNameContainer>

    </Tag>
  );
}

export default GenreTag;

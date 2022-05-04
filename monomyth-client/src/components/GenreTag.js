import { React, useEffect, useState } from 'react';
import styled from 'styled-components';
import Tooltip from './Tooltip';

const Tag = styled.button`
  background-color: none;
  color: #eee;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: .25rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
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
  display: inline-block;
  padding-bottom: .1rem;
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

  const onGenreBlur = (e) => {
    e.preventDefault();
    setShowTooltip(false);
  }

  return (
    <Tag onClick={onGenreClick} onBlur={onGenreBlur} >
      <Dot genreColor={props.genre.color} />
      <GenreNameContainer>
        <GenreName >{props.genre.name}</GenreName>
        {(showTooltip) ? <Tooltip tooltipString={props.genre.description} /> : null }
      </GenreNameContainer>

    </Tag>
  );
}

export default GenreTag;

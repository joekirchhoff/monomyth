import { React, useState, useRef } from 'react';
import styled from 'styled-components';
import Tooltip from './Tooltip';

const Tag = styled.button`
  background-color: none;
  color: ${props => props.theme.textMainColor};
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: .25rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  :focus {
    outline: none;
  }
`

const Dot = styled.div`
  background-color: ${props => props.genreColor};
  border-radius: 100%;
  height: .5rem;
  width: .5rem;
  margin: .5rem;
`

const GenreName = styled.span`
  display: inline-block;
  padding-bottom: .1rem;
  font-size: .8rem;
  border: none;
  background-color: transparent;
`

function GenreTag(props) {

  // Handle tooltip display state
  const [showTooltip, setShowTooltip] = useState(false);
  const genreTagRef = useRef();

  const onGenreClick = (e) => {
    e.preventDefault();
    setShowTooltip(!showTooltip);
    genreTagRef.current.focus();
  }

  const onGenreBlur = (e) => {
    setShowTooltip(false);
  }

  return (
    <Tag onMouseDown={onGenreClick} onBlur={onGenreBlur} ref={genreTagRef} >
      <Dot genreColor={props.genre.color} />
      <div>
        <GenreName >{props.genre.name}</GenreName>
        {(showTooltip && props.includeTooltip) ? <Tooltip tooltipString={props.genre.description} /> : null }
      </div>

    </Tag>
  );
}

export default GenreTag;

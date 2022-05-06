import { React } from 'react';
import styled from 'styled-components';

// Version of GenreTag component without interactive tooltip (used for StoryCard component) 

const Tag = styled.div`
  background-color: none;
  color: ${props => props.theme.textMainColor};
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: .25rem;
  background-color: transparent;
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

function StoryCardGenreTag(props) {

  return (
    <Tag>
      <Dot genreColor={props.genre.color} />
      <GenreName >{props.genre.name}</GenreName>
    </Tag>
  );
}

export default StoryCardGenreTag;

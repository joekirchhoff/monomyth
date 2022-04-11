import { React, useRef, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

const Card = styled(Link)`
  background-color: black;
  color: white;
  padding: 1rem;
  max-width: 750px;
  width: 90%;
  margin: 2rem auto;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  text-decoration: none;
  :hover {
    background-color: gray;
  }
`

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
`

const Byline = styled.h2`
  font-size: 1.5rem;
  text-align: center;
`

function StoryCard(props) {

  return (
    <Card to={`/story/${props.story._id}`}>
      <Title >{props.story.title}</Title>
      <Byline >{props.story.author.username}</Byline>
    </Card>
  );
}

export default StoryCard;

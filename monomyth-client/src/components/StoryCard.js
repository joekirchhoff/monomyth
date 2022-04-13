import { React, useRef, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import LikeButton from './LikeButton';

const Card = styled(Link)`
  background-color: #222;
  color: white;
  padding: 1rem;
  max-width: 750px;
  width: 90%;
  margin: 2rem auto;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  :hover {
    background-color: #333;
  }
`

const LeftContainer = styled.div`
  flex: 1;
`

const CentralContainer = styled.div`
  flex: 2;
`

const RightContainer = styled.div`
  flex: 1;
  text-align: right;
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

  // Like button toggle state
  const [storyLiked, setStoryLiked] = useState(false);
  // Like button error shown (true) if not logged in; links to log in page
  const [likeBtnError, setLikeBtnError] = useState(false);

  // Check if user has liked story already
  useEffect(() => {
    if (props.story && props.currentUser) {
      if (props.story.likes.includes(props.currentUser._id)) {
        setStoryLiked(true);
      } else {
        setStoryLiked(false);
      }
    }
  }, [props.story, props.currentUser])

  const onLikeButtonClick = (e) => {

    e.preventDefault();

    // User not logged in; prompt log in error message
    if (!props.currentUser) {
      window.location.replace('/login');
    }
    // Story not liked; send like request to API
    if (props.currentUser && !storyLiked) {
      fetch(`http://localhost:8080/api/stories/${props.story._id}/likes`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      })
      .then(res => {
        return res.json();
      })
      .then(res => {
        setStoryLiked(true);
      });
    } else if (props.currentUser &&  storyLiked) { // Story already liked; send unlike request to API
      fetch(`http://localhost:8080/api/stories/${props.story._id}/likes`, {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      })
      .then(res => {
        return res.json();
      })
      .then(res => {
        setStoryLiked(false);
      });
    }
  }

  return (
    <Card to={`/story/${props.story._id}`}>
      <LeftContainer>
        <LikeButton onClick={onLikeButtonClick} isLiked={storyLiked} />
      </LeftContainer>
      <CentralContainer>
        <Title >{props.story.title}</Title>
        <Byline >by {props.story.author.username}</Byline>
      </CentralContainer>
      <RightContainer>
        Date
      </RightContainer>
    </Card>
  );
}

export default StoryCard;

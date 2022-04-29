import { React, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import DateTag from './DateTag';
import GenreTag from './GenreTag';
import LikeButton from './LikeButton';

const Card = styled(Link)`
  background-color: #222;
  border: gray solid 1px;
  color: #eee;
  text-decoration: none;
  min-width: 350px;
  max-width: 750px;
  width: 90%;
  margin: 0 auto 2rem auto;
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  grid-template-rows: 1fr 2rem;
  :hover {
    background-color: #333;
  }
  align-items: center;
`

const LeftContainer = styled.div`
  grid-area: 1 / 1 / span 1 / span 1;
  padding-left: 1rem;
`

const CentralContainer = styled.div`
  grid-area: 1 / 2 / span 1 / span 1;
  padding: 1rem;
`

const RightContainer = styled.div`
  grid-area: 1 / 3 / span 1 / span 1;
  text-align: right;
  /* align-self: start; */
  padding-right: 1rem;
`

const BottomContainer = styled.div`
  grid-area: 2 / 1 / span 1 / span 3;
  display: flex;
  flex-flow: row nowrap;
  border-top: gray solid 1px;
`

const Title = styled.h1`
  font-size: 1.5rem;
  text-align: center;
  font-weight: 700;
`

const Byline = styled.h2`
  font-size: 1rem;
  text-align: center;
  font-weight: 100;
`

function StoryCard(props) {

  // Like button toggle state
  const [storyLiked, setStoryLiked] = useState(false);

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

    // User not logged in; redirect to login
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
        <DateTag date={props.story.date} />
      </RightContainer>
      <BottomContainer >
        {props.story.genres.map((genre) => {
            return <GenreTag key={genre._id} genre={genre} />
        })}
      </BottomContainer>
    </Card>
  );
}

export default StoryCard;

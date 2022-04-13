import { React, useRef, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import LikeButton from './LikeButton';

const Card = styled.div`
  background-color: #222;
  color: white;
  padding: 1rem;
  max-width: 750px;
  width: 90%;
  margin: 1rem auto;
  display: grid;
  grid-template-columns: 4rem 1fr 10rem;
  grid-template-rows: 2.5rem 1fr;
`

const Byline = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  padding: 1rem;
  grid-area: 1/2/span 1/span 1;
`

const CommentDate = styled.p`
  grid-area: 1/3/span 1/span 1;
  padding: 1rem;
  text-align: right;
`

const CommentText = styled.p`
  grid-area: 2/2/span 1/span 2;
  padding: 1rem;
`

function Comment(props) {

  // Like button toggle state
  const [commentLiked, setCommentLiked] = useState(false);
  // Like button error shown (true) if not logged in; links to log in page
  const [likeBtnError, setLikeBtnError] = useState(false);

  // Check if user has liked story already
  useEffect(() => {
    if (props.comment && props.currentUser) {
      if (props.comment.likes.includes(props.currentUser._id)) {
        setCommentLiked(true);
      } else {
        setCommentLiked(false);
      }
    }
  }, [props.comment, props.currentUser])

  const onLikeButtonClick = (e) => {

    e.preventDefault();

    // User not logged in; prompt log in error message
    if (!props.currentUser) {
      window.location.replace('/login');
    }
    console.log('storyID: ', props.storyID, ' commentID: ', props.comment._id);
    // Comment not liked; send like request to API
    if (props.currentUser && !commentLiked) {
      fetch(`http://localhost:8080/api/stories/${props.storyID}/comments/${props.comment._id}/likes`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      })
      .then(res => {
        return res.json();
      })
      .then(res => {
        setCommentLiked(true);
      });
    } else if (props.currentUser &&  commentLiked) { // Comment already liked; send unlike request to API
      fetch(`http://localhost:8080/api/stories/${props.storyID}/comments/${props.comment._id}/likes`, {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      })
      .then(res => {
        return res.json();
      })
      .then(res => {
        setCommentLiked(false);
      });
    }
  }

  return (
    <Card>
      <LikeButton isOnComment onClick={onLikeButtonClick} isLiked={commentLiked} />
      <Byline to={`/user/${props.comment.author._id}`}>{props.comment.author.username}</Byline>
      <CommentDate >Date</CommentDate>
      <CommentText >{props.comment.text}</CommentText>
    </Card>
  );
}

export default Comment;

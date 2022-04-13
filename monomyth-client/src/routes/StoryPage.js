import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Story from '../components/Story';
import CommentForm from '../components/CommentForm';
import Comment from '../components/Comment';

const PageContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
`

const CommentsHeader = styled.h1`
  font-size: 1.5rem;
  text-align: center;
  color: white;
`

const RevealCommentFormBtn = styled.button`
  padding: 1rem;
  margin: 1rem auto;
  background-color: palevioletred;
  color: white;
  border-style: none;
  cursor: pointer;
` 

function StoryPage(props) {

  const storyID = useParams().storyID;

  // Comments
  const [comments, setComments] = useState(null)

  const getComments = (() => {
    fetch(`http://localhost:8080/api/stories/${storyID}/comments`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}, 
      credentials: 'include'
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      setComments(data);
    })
  })

  useEffect(() => {
    getComments();
  }, [])

  // Show / hide add comment form
  const [commentFormOpen, setCommentFormOpen] = useState(false);

  const revealCommentFormClick = (e) => {
    setCommentFormOpen(true);
  }

  const hideCommentFormClick = (e) => {
    setCommentFormOpen(false);
  }

  return (
    <PageContainer>
      <Story storyID={storyID} currentUser={props.currentUser} />
      {(comments && comments.length) ? 
        <CommentsHeader >{comments.length} Comments</CommentsHeader>
      : <CommentsHeader>No Comments</CommentsHeader>
      }
      {(commentFormOpen) ? 
        <CommentForm storyID={storyID} currentUser={props.currentUser} hideCommentFormClick={hideCommentFormClick}/> 
      : <RevealCommentFormBtn onClick={revealCommentFormClick}>Add Comment</RevealCommentFormBtn>
      }
      {(comments) ?
        comments.map((comment) => {
          return <Comment key={comment._id} comment={comment} currentUser={props.currentUser} storyID={storyID}/>
        })
      : null
      }
    </PageContainer>
  );
}

export default StoryPage;

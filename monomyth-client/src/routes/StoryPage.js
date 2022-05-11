import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Story from '../components/Story';
import CommentForm from '../components/CommentForm';
import Comment from '../components/Comment';
import CommentSorter from '../components/CommentSorter';

const PageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
`

const CommentsHeader = styled.h1`
  font-size: 1.5rem;
  text-align: center;
`

const CommentsErrorMessage = styled.span`
  text-align: center;
  color: ${props => props.theme.textWarningColor};
  padding-bottom: 1rem;
`

const RevealCommentFormBtn = styled.button`
  padding: 1rem;
  margin: 1rem auto;
  background-color: ${props => props.theme.btnPrimaryBgColor};
  color: ${props => props.theme.btnPrimaryTextColor};
  border-radius: 5rem;
  border-style: none;
  cursor: pointer;
  box-shadow: ${props => props.theme.boxShadowMain};
` 

function StoryPage(props) {

  // Scroll to top of page on render
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [commentsError, setCommentsError] = useState('');

  const storyID = useParams().storyID;

  // Comments
  const [comments, setComments] = useState(null)
  const [commentSortMethod, setCommentSortMethod] = useState('score');

  const getComments = (() => {

    // Specify comment sort method as string query
    fetch(`http://localhost:8080/api/stories/${storyID}/comments?sort=${commentSortMethod}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}, 
      credentials: 'include'
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      if (data.error) {
        setCommentsError(data.error.message);
      } else {
        setComments(data);
      }
    })
  })

  // Get comments on page load, update if commentSortMethod changes
  useEffect(() => {
    getComments();
  }, [commentSortMethod])

  // Show / hide add comment form, if logged in; else redirect to login form
  const [commentFormOpen, setCommentFormOpen] = useState(false);

  const revealCommentFormClick = (e) => {
    if (props.currentUser) {
      setCommentFormOpen(true);
    } else {
      window.location.assign('/login');
    }
  }

  const hideCommentFormClick = (e) => {
    setCommentFormOpen(false);
  }

  return (
    <PageContainer>
      <Story storyID={storyID} currentUser={props.currentUser} />
      <CommentsErrorMessage>{commentsError}</CommentsErrorMessage>
      {(comments && comments.length) ? 
        <CommentsHeader >{comments.length} Comments</CommentsHeader>
      : <CommentsHeader>No Comments</CommentsHeader>
      }
      {(commentFormOpen) ? 
        <CommentForm storyID={storyID} currentUser={props.currentUser} hideCommentFormClick={hideCommentFormClick}/> 
      : <RevealCommentFormBtn onClick={revealCommentFormClick}>Add Comment</RevealCommentFormBtn>
      }
      <CommentSorter setCommentSortMethod={setCommentSortMethod} />
      {(comments) ?
        comments.map((comment) => {
          return <Comment
            key={comment._id}
            comment={comment}
            currentUser={props.currentUser}
            storyID={storyID}
          />
        })
      : null
      }
    </PageContainer>
  );
}

export default StoryPage;

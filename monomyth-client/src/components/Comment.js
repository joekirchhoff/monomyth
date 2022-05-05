import { React, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import DateTag from './DateTag';
import LikeButton from './LikeButton';

const Card = styled.div`
  background-color: ${props => props.theme.bgMainColor};
  padding: 1rem;
  max-width: 750px;
  width: 100%;
  margin: 1rem auto;
  display: grid;
  grid-template-columns: 4rem 1fr 8rem;
  grid-template-rows: 4rem 1fr;
  box-shadow: ${props => props.theme.boxShadowMain};
`

const ErrorMsg = styled.p`
  color: ${props => props.theme.textErrorColor};
  text-align: center;
`

// COMMENT STYLING ==============================

const Byline = styled(Link)`
  color: ${props => props.theme.textLinkColor};
  font-size: 1.5rem;
  line-height: 1.5rem;
  padding: 1rem;
  grid-area: 1/2/span 1/span 1;
  display: flex;
  align-items: center;
  width: fit-content;
`

const DateContainer = styled.div`
  grid-area: 1/3/span 1/span 1;
  padding: 1rem;
  text-align: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const CommentText = styled.p`
  border-top: gray solid 1px;
  white-space: pre-line;
  grid-area: 2/1/span 1/span 3;
  padding: 1rem;
  font-weight: 300;
  line-height: 1.5rem;
`

// EDIT COMMENT FORM STYLING ====================

const EditBtn = styled.button`
  color: ${props => props.theme.textLinkColor};
  background-color: transparent;
  border: none;
  padding-right: 1rem;
  grid-area: 3/3/span 1/span 1;
  text-align: right;
  cursor: pointer;
`

const EditForm = styled.form`
  grid-area: 2/1/span 2/span 3;
`

const EditTextarea = styled.textarea`
  resize: vertical;
  background-color: ${props => props.theme.inputBgColor};
  color: ${props => props.theme.inputTextColor};
  border: gray solid 1px;
  padding: .5rem;
  margin: .5rem .5rem 0 .5rem;
  width: calc(100% - 1rem);
  min-height: 10rem;
`

const EditBtnContainer = styled.ul`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
`

const SubmitBtn = styled.button`
  border: none;
  background-color: ${props => props.theme.btnPrimaryBgColor};
  color: ${props => props.theme.btnPrimaryTextColor};
  padding: 1rem;
  margin: 1rem;
  cursor: pointer;
`

const CancelBtn = styled.button`
  border: ${props => props.theme.borderMain};
  background-color: ${props => props.theme.btnCancelBgColor};
  color: ${props => props.theme.btnCancelTextColor};
  padding: 1rem;
  margin: 1rem;
  cursor: pointer;
`

// DELETE FORM STYLING ==========================

const DeleteMenuBtn = styled.button`
  color: ${props => props.theme.textLinkColor};
  background-color: transparent;
  border: none;
  padding-right: 1rem;
  grid-area: 4/3/span 1/span 1;
  text-align: right;
  cursor: pointer;
`

const DeleteForm = styled.form`
  grid-area: 4/3/span 1/span 1;
`

const DeletePrompt = styled.p`
  text-align: center;
`

const DeleteBtnContainer = styled.ul`
  padding: .5rem;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-evenly;
  align-items: center;
`

const ConfirmDeleteBtn = styled.button`
  padding: .5rem;
  margin: .5rem;
  color: ${props => props.theme.textMainColor};
  background-color: ${props => props.theme.bgWarningColor};
  border: none;
  cursor: pointer;
`

const CancelDeleteBtn = styled.button`
  padding: .5rem;
  margin: .5rem;
  color: ${props => props.theme.btnCancelTextColor};
  background-color: ${props => props.theme.btnCancelBgColor};
  border: ${props => props.theme.borderMain};
  cursor: pointer;
`

function Comment(props) {

  // COMMENT LIKE ===============================

  // Like button toggle state
  const [commentLiked, setCommentLiked] = useState(false);

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

  // COMMENT EDIT ===============================

  // Edit comment form handling; if editable === true, show edit form in place of comment
  const [editable, setEditable] = useState(false);

  const onEditClick = (e) => {
    setEditable(true);
  }

  const onCancelClick = (e) => {
    setEditable(false);
    setShowDeleteForm(false);
  }

  // Editable textarea handling; set initial value to comment text
  const [commentEditValue, setCommentEditValue] = useState(props.comment.text);

  const onEditValueChange = (e) => {
    setCommentEditValue(e.target.value);
  }

  // Edit form error messaging
  const [errorMessage, setErrorMessage] = useState('');

  // Edit form submit handling
  const onSubmit = (e) => {
    e.preventDefault();

    // Attempt to update comment
    fetch(`http://localhost:8080/api/stories/${props.storyID}/comments/${props.comment._id}`, {
      method: "PUT",
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify({
        'text': commentEditValue,
      }),
      credentials: 'include'
    })
    .then(res => {
      return res.json();
    })
    .then(res => {
      if (!res.message) { // Successfully saved to database, refresh page
        window.location.reload();
      } else { // Something went wrong; update error message
        setErrorMessage(res.message);
      }
    });
  }

  // COMMENT DELETE =============================

  // Comment delete form handling
  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const onInitialDeleteClick = (e) => {
    e.preventDefault();
    setShowDeleteForm(true);
  }

  const onCancelDeleteClick = (e) => {
    e.preventDefault();
    setShowDeleteForm(false);
  }

  // Handle delete form submission
  const onDeleteSubmit = (e) => {
    e.preventDefault();

    // Attempt to delete comment
    fetch(`http://localhost:8080/api/stories/${props.storyID}/comments/${props.comment._id}`, {
      method: "DELETE",
      headers: {'Content-Type': 'application/json'}, 
      credentials: 'include'
    })
    .then(res => {
      return res.json();
    })
    .then(res => {
      if (!res.message) { // Successfully deleted, refresh page
        window.location.reload();
      } else { // Something went wrong; update error message
        setErrorMessage(res.message);
      }
    });
  }


  return (
    <Card>
      <LikeButton isOnComment onClick={onLikeButtonClick} isLiked={commentLiked} />
      <Byline to={`/user/${props.comment.author._id}`}>{props.comment.author.username}</Byline>
      <DateContainer >
        <DateTag date={props.comment.date} />
      </DateContainer>
      {(editable) ?
        <EditForm>
          <EditTextarea value={commentEditValue} onChange={onEditValueChange} />
          <EditBtnContainer>
            <SubmitBtn onClick={onSubmit} >Submit</SubmitBtn>
            <CancelBtn onClick={onCancelClick} type='button' >Cancel</CancelBtn>
          </EditBtnContainer>
          {(errorMessage) ? <ErrorMsg>{errorMessage}</ErrorMsg> : null}
        </EditForm>
        : <CommentText >{props.comment.text}</CommentText>
      }
      {(props.currentUser && props.comment.author._id === props.currentUser._id && !editable) ?
        <EditBtn onClick={onEditClick} >Edit</EditBtn>
        : null
      }
      {(editable && !showDeleteForm) ? <DeleteMenuBtn onClick={onInitialDeleteClick} >Delete</DeleteMenuBtn> : null}
      {(showDeleteForm) ?
        <DeleteForm>
          <DeletePrompt>Are you sure you want to delete this comment?</DeletePrompt>
          <DeleteBtnContainer>
            <ConfirmDeleteBtn onClick={onDeleteSubmit} >Delete</ConfirmDeleteBtn>
            <CancelDeleteBtn onClick={onCancelDeleteClick} >Cancel</CancelDeleteBtn>
          </DeleteBtnContainer>
        </DeleteForm>
        : null
      }
    </Card>
  );
}

export default Comment;

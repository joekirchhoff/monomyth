import { React, useEffect, useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  background-color: ${props => props.theme.bgMainColor};
  max-width: 750px;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  margin: 1rem auto;
  box-shadow: ${props => props.theme.boxShadowMain};
`

const Header = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`

const Input = styled.textarea`
  min-width: 90%;
  max-width: 90%;
  min-height: 3rem;
  height: 2rem;
  border: none;
  margin-bottom: 1rem;
  padding: 1rem;
  width: 90%;
  background-color: ${props => props.theme.inputBgColor};
  color: ${props => props.theme.inputTextColor};
  border: ${props => props.theme.borderMain}
`

const BtnContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
`

const SubmitBtn = styled.button`
  border: none;
  background-color: ${props => props.theme.btnPrimaryBgColor};
  color: ${props => props.theme.btnPrimaryTextColor};
  padding: 1rem;
  margin: 1rem;
  cursor: pointer;
  :disabled {
    background-color: ${props => props.theme.btnDisabledBgColor};
    color: ${props => props.theme.btnDisabledTextColor};
  }
`

const CancelBtn = styled.button`
  border: ${props => props.theme.borderMain};
  background-color: ${props => props.theme.btnCancelBgColor};
  color: ${props => props.theme.btnCancelTextColor};
  padding: 1rem;
  margin: 1rem;
  cursor: pointer;
`

const ErrorPrompt = styled.p`
  color: ${props => props.theme.textWarningColor};
  margin-top: 1rem;
`

function CommentForm(props) {

  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e) => {
    
    e.preventDefault();

    // Get form body
    const commentTextToAdd = commentText;

    // Attempt to post comment
    fetch(`http://localhost:8080/api/stories/${props.storyID}/comments`, {
      method: "POST",
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify({
        'text': commentTextToAdd,
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

  const [commentText, setCommentText] = useState('');

  const onCommentTextChange = (e) => {
    setCommentText(e.target.value);
  }

  // Disable submit button until all fields complete
  useEffect(() => {
    const submitBtn = document.getElementById('submit');
    if (commentText.length) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  }, [commentText])

  return (
    <Form onSubmit={handleSubmit}>
      <Header >Add Comment as {props.currentUser.username}</Header>
      <Input name='commentText' placeholder='What did you think of this story?' value={commentText} onChange={onCommentTextChange}/>
      {(errorMessage) ? <ErrorPrompt >{errorMessage}</ErrorPrompt> : null }
      <BtnContainer>
        <SubmitBtn id='submit' type='submit' disabled>Submit</SubmitBtn>
        <CancelBtn onClick={props.hideCommentFormClick} >Cancel</CancelBtn>
      </BtnContainer>
    </Form>
  );
}

export default CommentForm;

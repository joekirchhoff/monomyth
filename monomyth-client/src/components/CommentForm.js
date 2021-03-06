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
  margin: 2rem auto;
  box-shadow: ${props => props.theme.boxShadowMain};
`

const Header = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  padding: 1rem;
`

const Input = styled.textarea`
  width: calc(100% - 1rem);
  line-height: 1.5rem;
  min-height: 6rem;
  height: 2rem;
  border: none;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: ${props => props.theme.inputBgColor};
  color: ${props => props.theme.inputTextColor};
  border: ${props => props.theme.borderMain};
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
    fetch(`https://monomyth.herokuapp.com/api/stories/${props.storyID}/comments`, {
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
      if (res.authError) { // Authentication error; user not logged in
        setErrorMessage(res.authError);
      } else if (res.validationError) { // Validation error; text-area blank
        setErrorMessage(res.validationError)
      } else {  // Successful comment post
        window.location.reload();
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
      <Input
        name='commentText'
        placeholder='What did you think of this story?'
        value={commentText}
        onChange={onCommentTextChange}
        required
      />
      {(errorMessage) ? <ErrorPrompt >{errorMessage}</ErrorPrompt> : null }
      <BtnContainer>
        <SubmitBtn id='submit' type='submit' disabled>Submit</SubmitBtn>
        <CancelBtn onClick={props.hideCommentFormClick} >Cancel</CancelBtn>
      </BtnContainer>
    </Form>
  );
}

export default CommentForm;

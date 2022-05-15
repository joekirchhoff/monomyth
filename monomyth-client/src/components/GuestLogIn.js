import { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  border: ${props => props.theme.borderMain};
  background-color: ${props => props.theme.bgMainColor};
  max-width: 750px;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.boxShadowMain};
`

const Header = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`

const SubmitBtn = styled.button`
  border: none;
  background-color: ${props => props.theme.btnPrimaryBgColor};
  color: ${props => props.theme.btnPrimaryTextColor};
  padding: 1rem;
  margin: 1rem;
  cursor: pointer;
`

const ErrorMessage = styled.p`
  color: ${props => props.theme.textWarningColor};
`

function GuestLogIn() {

  const [showError, setShowError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('https://monomyth.herokuapp.com/api/users/session', {
      method: "POST",
      headers: {'Content-Type': 'application/json'}, 
      credentials: 'include',
      body: JSON.stringify({
        'username': 'guest@monomyth.com',
        'password': 'guestpass'
      })
    })
    .then(res => {
      return res.json();
    })
    .then(res => {
      // Successful login; redirect to home
      if (res.user) {
        window.location.assign('/');
      } else { // Bad login; show error message 
        setShowError(true);
      }
    });
  }

  return (
    <Form>
      <Header >Just looking for a demo?</Header>
      <SubmitBtn type='submit' onClick={handleSubmit}>Continue as Guest</SubmitBtn>
      {(showError) ? <ErrorMessage >Sorry, something went wrong logging in! Please try again later.</ErrorMessage> : null}
    </Form>
  );
}

export default GuestLogIn;

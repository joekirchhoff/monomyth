import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Form = styled.form`
  border: gray solid 1px;
  background-color: #222;
  max-width: 750px;
  width: 90%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  margin: 2rem auto;
  box-shadow:
    .25rem .5rem 1rem rgba(0, 0, 0, 0.3),
    0 0 1.5rem rgba(0, 0, 0, .2);
`

const Header = styled.h1`
  font-size: 2rem;
  color: #eee;
  margin-bottom: 2rem;
  text-align: center;
`

const SubmitBtn = styled.button`
  border: none;
  background-color: #eee;
  color: #111;
  padding: 1rem;
  margin: 1rem;
  cursor: pointer;
`

const ErrorMessage = styled.p`
  color: red;
`

function GuestLogIn() {

  const [showError, setShowError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/api/users/session', {
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

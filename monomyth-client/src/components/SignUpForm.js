import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Form = styled.form`
  background-color: #222;
  max-width: 750px;
  width: 90%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  margin: 2rem auto;
`

const Header = styled.h1`
  font-size: 2rem;
  color: #eee;
  margin-bottom: 2rem;
`

const Label = styled.label`
  color: #eee;
`

const Input = styled.input`
  min-width: 200px;
  max-width: 300px;
  width: 90%;
  height: 2rem;
  border: none;
  margin-bottom: 1rem;
  padding-left: 1rem;
  background-color: #111;
  color: #eee;
  border: solid gray 1px;
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
  color: firebrick;
`

const RedirectPrompt = styled.p`
  color: #eee;
  margin-top: 2rem;
`

const RedirectLink = styled(Link)`
  color: #eee;
`

function SignUpForm() {

  const [showError, setShowError] = useState(false)

  const handleSubmit = (e) => {
    
    e.preventDefault();
    fetch('http://localhost:8080/api/users', {
      method: "POST",
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify({
        'email': document.getElementById('email').value,
        'username': document.getElementById('username').value,
        'password': document.getElementById('password').value
      }),
      credentials: 'include'
    })
    .then(res => {
      return res.json();
    })
    .then(res => {
      // Successful sign up; log in and redirect to account
      if (res.user) {
        window.location.assign(`/user/${res.user._id}`);
      } else { // Bad sign up; show error message
        setShowError(true);
      }
    });
  }

  return (
    <Form>
      <Header >Sign up</Header>
      <Label htmlFor='email' >Email</Label>
      <Input id='email' type='email' name='email'/>
      <Label htmlFor='username' >Username</Label>
      <Input id='username' type='text' name='username'/>
      <Label htmlFor='password' >Password</Label>
      <Input id='password' type='password' name='password'/>
      {(showError) ? <ErrorMessage >Incorrect email and/or password</ErrorMessage> : null }
      <SubmitBtn type='submit' onClick={handleSubmit}>Submit</SubmitBtn>
      <RedirectPrompt>Already have an account?</RedirectPrompt>
      <RedirectLink to='/login'>Log in here</RedirectLink>
    </Form>
  );
}

export default SignUpForm;

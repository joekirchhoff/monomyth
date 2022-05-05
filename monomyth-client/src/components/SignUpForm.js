import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Form = styled.form`
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
`

const Label = styled.label`
  font-size: 1.25rem;
  padding-bottom: .25rem;
  user-select: none;
`

const Input = styled.input`
  min-width: 200px;
  max-width: 300px;
  width: 90%;
  height: 2rem;
  border: none;
  margin-bottom: 1rem;
  padding-left: 1rem;
  background-color: ${props => props.theme.inputBgColor};
  color: ${props => props.theme.inputTextColor};
  border: ${props => props.theme.borderMain};
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

const RedirectPrompt = styled.p`
  margin-top: 2rem;
`

const RedirectLink = styled(Link)`
  color: ${props => props.theme.textLinkColor};
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

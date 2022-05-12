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
  margin-top: 1rem;
`

const Input = styled.input`
  min-width: 200px;
  max-width: 300px;
  width: 90%;
  height: 2rem;
  border: none;
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

const ErrorMessage = styled.span`
  color: ${props => props.theme.textWarningColor};
  padding: .25rem;
  font-size: .8rem;
`

const RedirectPrompt = styled.span`
  margin-top: 2rem;
`

const RedirectLink = styled(Link)`
  color: ${props => props.theme.textLinkColor};
`

function SignUpForm() {

  // Inline Error Messages
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Submission errors; express-validator errors return an array of error objects;
  // Duplication error (i.e. username already in use) return as single error object
  const [submitErrors, setSubmitErrors] = useState();

  // Validation Checks
  const onEmailBlur = () => {
    const emailInput = document.getElementById('email');
    if (emailInput.validity.typeMismatch || emailInput.validity.valueMissing) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  }

  const onUsernameBlur = () => {
    const usernameInput = document.getElementById('username');
    if (usernameInput.validity.valueMissing) {
      setUsernameError('Please enter a username');
    } else {
      setUsernameError('');
    }
  }

  const onPasswordBlur = () => {
    const passwordInput = document.getElementById('password');
    if (passwordInput.validity.valueMissing || passwordInput.validity.tooShort) {
      setPasswordError('Please enter a password at least five (5) characters long');
    } else {
      setPasswordError('');
    }
  }

  // Form Submission
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
      if (res.user) {
        // Successful sign up; log in and redirect to account
        window.location.assign(`/user/${res.user._id}`);
      } else if (res.validateErrors) {
        // Validation errors server-side; show error message array
        setSubmitErrors(res.validateErrors);
      } else if (res.duplicationError) {
        // Email or username already exist; show error message
        setSubmitErrors(res.duplicationError);
      }
    });
  }

  return (
    <Form>
      <Header >Sign up</Header>

      <Label htmlFor='email' >Email</Label>
      <Input id='email' type='email' name='email' required onBlur={onEmailBlur} />
      <ErrorMessage>{emailError}</ErrorMessage>

      <Label htmlFor='username' >Username</Label>
      <Input id='username' type='text' name='username' required onBlur={onUsernameBlur} />
      <ErrorMessage>{usernameError}</ErrorMessage>

      <Label htmlFor='password' >Password</Label>
      <Input id='password' type='password' name='password' minLength='5' required onBlur={onPasswordBlur} />
      <ErrorMessage>{passwordError}</ErrorMessage>

      <SubmitBtn type='submit' onClick={handleSubmit}>Submit</SubmitBtn>
      {(Array.isArray(submitErrors)) ?
        submitErrors.map(error => {
          return <ErrorMessage key={error.msg} >{error.msg}</ErrorMessage>
        })
        : <ErrorMessage>{submitErrors}</ErrorMessage>
      }

      <RedirectPrompt>Already have an account?</RedirectPrompt>
      <RedirectLink to='/login'>Log in here</RedirectLink>
    </Form>
  );
}

export default SignUpForm;

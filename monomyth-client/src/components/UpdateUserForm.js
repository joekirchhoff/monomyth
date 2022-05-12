import { useState } from 'react';
import styled from 'styled-components';

const UserForm = styled.form`
  background-color: ${props => props.theme.bgMainColor};
  padding: 2rem;
  max-width: 750px;
  width: 100%;
  margin: 2rem auto;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  box-shadow: ${props => props.theme.boxShadowMain};
`

const Label = styled.label`
  user-select: none;
  cursor: pointer;
  text-align: center;
  font-size: 1.25rem;
  padding-bottom: .25rem;
`

const BioInput = styled.textarea`
  border: ${props => props.theme.borderMain};
  background-color: ${props => props.theme.inputBgColor};
  color: ${props => props.theme.inputTextColor};
  margin-bottom: 2rem;
  width: 100%;
  min-height: 10rem;
  padding: .5rem;
`

const LinkInput = styled.input`
  padding: .5rem;
  border: ${props => props.theme.borderMain};
  background-color: ${props => props.theme.inputBgColor};
  color: ${props => props.theme.inputTextColor};
  margin-bottom: 2rem;
  width: 100%;
  max-width: 20rem;
`

const OptionalMsg = styled.p`
  padding: .5rem;
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
`

const CancelBtn = styled.button`
  border: ${props => props.theme.borderMain};
  background-color: ${props => props.theme.btnCancelBgColor};
  color: ${props => props.theme.btnCancelTextColor};
  padding: 1rem;
  margin: 1rem;
  cursor: pointer;
`

const ErrorMsg = styled.p`
  color: ${props => props.theme.textWarningColor};
`

const UpdateUserForm = (props) => {

  // Load pre-existing user info into form, if any; otherwise use empty strings
  const initialBio = props.user.bio;

  const initialLinks = [];
  for (let i = 0; i < 3; i++) {
    if (props.user.links[i]) {
      initialLinks[i] = props.user.links[i];
    } else {
      initialLinks[i] = '';
    }
  }

  // Error message handling
  const [error, setError] = useState('');

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const newBio = document.getElementById('bio').value;
    const newLinks = [];
    if (document.getElementById('link1').value) {
      newLinks.push(document.getElementById('link1').value)
    }
    if (document.getElementById('link2').value) {
      newLinks.push(document.getElementById('link2').value)
    }
    if (document.getElementById('link3').value) {
      newLinks.push(document.getElementById('link3').value)
    }

    fetch(`http://localhost:8080/api/users/${props.user._id}`, {
      method: "PUT",
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify({
        'bio': newBio,
        'links': newLinks
      }),
      credentials: 'include'
    })
    .then(res => {
      // Successful update; redirect to profile
      if (res.status === 200) {
        window.location.assign(`/user/${props.user._id}`);
      } else {
        // Error; parse error message JSON
        return res.json();
      }
    })
    .then(res => {
      // Error (continued); set error message for display
      if (res.authError) {
        setError(res.authError)
      } else if (res.validationErrors) {
        setError(res.validationErrors[0].msg);
      }
    });
  }

  // Handle cancel button (redirects to profile)
  const handleCancel = (e) => {
    e.preventDefault();
    window.location.assign(`/user/${props.user._id}`);
  }

  return (
    <UserForm>
      <Label htmlFor='bio' >Bio</Label>
      <BioInput id='bio' defaultValue={initialBio} />
      <Label htmlFor='link1' >Link #1</Label>
      <LinkInput id='link1' name='link1' defaultValue={initialLinks[0]} />
      <Label htmlFor='link2' >Link #2</Label>
      <LinkInput id='link2' name='link2' defaultValue={initialLinks[1]} />
      <Label htmlFor='link3' >Link #3</Label>
      <LinkInput id='link3' name='link3' defaultValue={initialLinks[2]} />
      <OptionalMsg>All fields are optional</OptionalMsg>
      <BtnContainer>
        <SubmitBtn type='submit' onClick={handleSubmit} >Update</SubmitBtn>
        <CancelBtn type='button' onClick={handleCancel} >Cancel</CancelBtn>
      </BtnContainer>
      {(error) ?
        <ErrorMsg>{error}</ErrorMsg>
      : null}
    </UserForm>
  )
}

export default UpdateUserForm;
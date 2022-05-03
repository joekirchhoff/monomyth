import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';

const DeleteForm = styled.form`
  filter: ${props => props.showBlur ? 'blur(3px)' : 'none'};
  background-color: #222;
  max-width: 750px;
  width: 95%;
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
  text-align: center;
`

const FormBtnList = styled.ul`
  display: flex;
  flex-flow: row nowrap;
  list-style: none;
  align-items: center;
`

const DeleteBtn = styled.button`
  border: none;
  background-color: firebrick;
  color: #eee;
  padding: 1rem;
  margin: 1rem;
  cursor: pointer;
`

const CancelBtn = styled(Link)`
  text-decoration: none;
  border: gray solid 1px;
  background-color: #111;
  color: #eee;
  padding: 1rem;
  margin: 1rem;
  cursor: pointer;
`

const ErrorMsg = styled.p`
  color: firebrick;
`

const DeleteStoryForm = (props) => {

  const storyID = useParams().storyID;

  const [error, setError] = useState('');

  const onDeleteClick = (e) => {

    fetch(`http://localhost:8080/api/stories/${storyID}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}, 
      credentials: 'include'
    })
    .then(res => {
      return res.json();
    })
    .then(storyData => {
      if (storyData.author._id !== props.currentUser._id) {
        // Author ID does not match current user ID, set error
        setError('Must be logged in as author to delete this story');
      } else {
        // Author ID matches user ID, procede to delete; (also verified on backend)
        fetch(`http://localhost:8080/api/stories/${storyID}`, {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json'}, 
          credentials: 'include'
        })
        .then(res => {
          return res.json();
        })
        .then(res => {
          if (res.message) {
            // Error occurred on backend; set error
            setError(res.message);
          } else {
            // Story deleted successfully; show DeleteReceipt on EditStoryPage and blur background
            props.setShowBlur(true);
            props.setShowDeleteReceipt(true);
          }
        })
      }
    })
  }

  return (
    <DeleteForm showBlur={props.showBlur} >
      <Header>Delete Story?</Header>
      <FormBtnList>
        <li>
          <DeleteBtn type='button' onClick={onDeleteClick} >Delete</DeleteBtn>
        </li>
        <li>
          <CancelBtn to={`/story/${storyID}`} >Cancel</CancelBtn>
        </li>
      </FormBtnList>
      {(error) ? <ErrorMsg>{error}</ErrorMsg> : null}
    </DeleteForm>
  )
}

export default DeleteStoryForm
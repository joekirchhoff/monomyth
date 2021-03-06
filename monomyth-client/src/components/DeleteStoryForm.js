import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';

const DeleteForm = styled.form`
  filter: ${props => props.showBlur ? 'blur(3px)' : 'none'};
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
  background-color: ${props => props.theme.bgWarningColor};
  color: ${props => props.theme.textMainColor};
  padding: 1rem;
  margin: 1rem;
  cursor: pointer;
`

const CancelBtn = styled(Link)`
  border: gray solid 1px;
  background-color: ${props => props.theme.btnCancelBgColor};
  color: ${props => props.theme.btnCancelTextColor};
  padding: 1rem;
  margin: 1rem;
  cursor: pointer;
`

const ErrorMsg = styled.p`
  color: ${props => props.theme.textWarningColor};
`

const DeleteStoryForm = (props) => {

  const storyID = useParams().storyID;
  const [error, setError] = useState('');

  // Handle whether "confirm delete" menu is visible
  const [confirmMenuOpen, setConfirmMenuOpen] = useState(false);

  // On first delete button click, open confirm menu
  const onInitialDeleteClick = (e) => {
    e.preventDefault();
    setConfirmMenuOpen(true);
  }

  const onConfirmDeleteClick = (e) => {

    fetch(`https://monomyth.herokuapp.com/api/stories/${storyID}`, {
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
        fetch(`https://monomyth.herokuapp.com/api/stories/${storyID}`, {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json'}, 
          credentials: 'include'
        })
        .then(res => {
          return res.json();
        })
        .then(res => {
          if (res.error) {
            // Error occurred on backend; set error
            setError(res.error);
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
      {confirmMenuOpen ?
        <FormBtnList>
          <li>
            <DeleteBtn type='button' onClick={onConfirmDeleteClick} >Confirm Delete</DeleteBtn>
          </li>
          <li>
            <CancelBtn to={`/story/${storyID}`} >Cancel</CancelBtn>
          </li>
        </FormBtnList>
        : <DeleteBtn onClick={onInitialDeleteClick} >Delete</DeleteBtn>
      }
      {(error) ? <ErrorMsg>{error}</ErrorMsg> : null}
    </DeleteForm>
  )
}

export default DeleteStoryForm
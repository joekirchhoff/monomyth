import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import styled from 'styled-components';
import UpdateUserForm from '../components/UpdateUserForm';

const PageContainer = styled.div`
  flex: 1;
`

const PageHeader = styled.h1`
  margin-top: 2rem;
  text-align: center;
  font-size: 2rem;
`

const ErrorMsg = styled.p`
  text-align: center;
`

function UpdateUserPage(props) {

  // Scroll to top of page on render
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const userID = useParams().userID;

  const [user, setUser] = useState({
    username: '',
    bio: '',
    links: []
  });

  const getUser = () => {
    fetch(`https://monomyth.herokuapp.com/api/users/${userID}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}, 
      credentials: 'include'
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      setUser(data);
    })
  }

  useEffect(() => {
    getUser();
  }, [])

  return (
    <PageContainer>
      <PageHeader>Update Profile: {user.username}</PageHeader>
      {(props.currentUser && user._id === props.currentUser._id) ?
        <UpdateUserForm user={user} />
      : <ErrorMsg>You must be logged in as this user to update profile</ErrorMsg>
      }
    </PageContainer>
  );
}

export default UpdateUserPage;

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import styled from 'styled-components';
import ProfileStorySorter from '../components/ProfileStorySorter';
import StoryCard from '../components/StoryCard';
import UserInfo from '../components/UserInfo';

const PageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
`

const ErrorMessage = styled.p`
  text-align: center;
  font-size: 1.5rem;
  padding: 1rem;
`

const Heading = styled.h1`
  text-align: center;
  font-size: 2rem;
  padding: 1.5rem;
`

const Bibliography = styled.section`
  width: 100%;
`

const CardList = styled.div`
  max-width: 750px;
  display: flex;
  flex-flow: column nowrap;
  margin: auto;
`

function UserPage(props) {

  // Scroll to top of page on render
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [error, setError] = useState('');

  // Get user info to pass to UserInfo component
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
      if (data.message) {
        // Error occurred, display message
        setError('Sorry, something went wrong! User not found.');
      } else {
        // Success, user found
        setUser(data);
      }
    })
  }

  // Get user stories (if any) to display as cards
  const [userStories, setUserStories] = useState([]);

  // Story sorting method; controlled by ProfileStorySorter component
  const [storySortMethod, setStorySortMethod] = useState('score')

  const getStories = () => {
    fetch(`https://monomyth.herokuapp.com/api/stories?author=${userID}&sort=${storySortMethod}`, { 
      method: "GET",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      setUserStories(response);
    })
  }

  useEffect(() => {
    getUser();
  }, [])

  useEffect(() => {
    getStories();
  }, [storySortMethod])

  return (
    <PageContainer>
      <Heading>User Profile</Heading>
      {(error) ?
        <ErrorMessage>{error}</ErrorMessage>
      : <UserInfo user={user} currentUser={props.currentUser} /> 
      }
      {(userStories.length) ?
        <Bibliography>
          <Heading>{user.username}'s Stories</Heading>
          <ProfileStorySorter setStorySortMethod={setStorySortMethod} />
          <CardList >
            {userStories.map(story => {
              return <StoryCard key={story._id} story={story} currentUser={props.currentUser} />
            })}
          </CardList>
        </Bibliography>
        
        
      : null
      }
    </PageContainer>
  );
}

export default UserPage;

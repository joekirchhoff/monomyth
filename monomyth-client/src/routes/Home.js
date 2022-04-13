import { React, useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import StoryCard from '../components/StoryCard';

const ErrorMessage = styled.p`
  text-align: center;
  color: darkred;
  font-size: 2rem;
`

const CardList = styled.div`
  width: 90%;
  max-width: 750px;
  padding: 1rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  margin: auto;
`

function Home(props) {

  // Error messaging
  const [errorMessage, setErrorMessage] = useState('');

  // Get story cards
  const [stories, setStories] = useState([]);

  const getStories = () => {

    fetch('http://localhost:8080/api/stories?sort=date', { 
      method: "GET",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      setStories(response);
    })
    .catch(function(err) {
      if (err) setErrorMessage(err);
    });
  }

  useEffect(() => {
    getStories();
  }, [])

  return (
    <div>
      {(errorMessage) ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
      <CardList >
        {stories.map((story) => {
          return <StoryCard key={story._id} story={story} />
        })}
      </CardList>
    </div>
  );
}

export default Home;

import { useEffect, useState } from 'react';
import styled from 'styled-components'

const Output = styled.div`
  background-color: tomato;
  color: white;
  font-size: 1rem;
  padding: 1rem;
  display: flex;
  flex-flow: column nowrap;
  margin: 1rem;
`

const BtnContainer = styled.div`
  display: flex;
  padding: 1rem;
  flex-flow: row nowrap;
  justify-content: space-evenly;
`

const UserBtn = styled.button`
  font-size: 1.5rem;
  background-color: lightseagreen;
  color: white;
  padding: 2rem;
  border: none;
`

function APITest() {

  const [stories, setStories] = useState([]);

  // Get post thumbs
  const getStories = () => {

    fetch('http://localhost:8080/api/stories?sort=date', { 
      mode: 'cors',
      method: "GET",
      headers: {
        // 'Content-Type': 'application/json'
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then(function(response) {
      // Successful response :)
      return response.json();
    })
    .then(function(response) {
      setStories(response);
    })
    .catch(function(err) {
      // Error
      if (err) console.log(err);
    });
  }

useEffect(() => {
  getStories();
}, [])

const LoginClick = () => {
  fetch('http://localhost:8080/api/users/session', {
    method: "POST",
    headers: {'Content-Type': 'application/json'}, 
    credentials: 'include',
    body: JSON.stringify({
      'username': 'fake@fake.com',
      'password': 'testpass'
    })
  })
  .then(res => {
    return res.json();
  })
  .then(res => {
    console.log("Request complete! response:", res);
    console.log('Username: ', res.username);
    // document.cookie = `user=${res.userID};secure`;
  });
}

const LogoutClick = () => {
  fetch('http://localhost:8080/api/users/session', {
    method: "DELETE",
    headers: {'Content-Type': 'application/json'},
    credentials: 'include'
  })
  .then(res => {
    return res.json();
  })
  .then(res => {
    console.log("Request complete! response:", res.message);
  });
}



  return (
    <div>
      <Output>This is the test!</Output>
      <BtnContainer>
        <UserBtn onClick={LoginClick}>Login</UserBtn>
        <UserBtn onClick={LogoutClick}>Logout</UserBtn>
      </BtnContainer>
      {stories.map((story) => {
        return <Output key={story._id}>
          <p>{story.title}</p>
          <p>{story.author.username}</p>
          <p>{story.text}</p>
          <p>{story.score}</p>
        </Output>
      })}
    </div>
  );
}

export default APITest;

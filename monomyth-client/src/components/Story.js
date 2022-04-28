import { React, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import LikeButton from './LikeButton';
import GenreTag from './GenreTag';
import DateTag from './DateTag';

const Article = styled.article`
  background-color: #222;
  color: white;
  padding: 1rem;
  max-width: 750px;
  width: 90%;
  margin: 2rem auto;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
`

const EditorWrapper = styled.div`
  padding: 1rem;
  min-height: 15rem;
  background-color: #222;
  color: white;
`

const DateContainer = styled.span`
  text-align: center;
  display: grid;
  grid-template-columns: 8rem;
  justify-content: end;
`

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
`

const AuthorLink = styled(Link)`
  font-size: 1.5rem;
  text-align: center;
  color: white;
  text-decoration: none;
`

const GenresContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  border-top: gray solid 1px;
  border-bottom: gray solid 1px;
  margin: 1rem 0;
`

const LikeBtnErrorMessage = styled(Link)`
  font-size: 1rem;
  text-align: center;
  color: white;
  margin: .5rem;
`

const EditLink = styled(Link)`
  padding: .5rem;
  text-align: right;
`

function Story(props) {

  // On page load, get and store story data in state
  const [story, setStory] = useState(null)
  
  // Story text rendered as a read-only Draft.js editor
  // to avoid additional third party dependencies
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );

  const onChange = (editorState) => {
      
      setEditorState(editorState)
    }

  const getStory = () => {
    fetch(`http://localhost:8080/api/stories/${props.storyID}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}, 
      credentials: 'include'
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      setStory(data);
      // Convert stored Draft.js content from raw format
      const correctedStoryRAW = data.text.replace(/(&quot\;)/g,"\"");
      const storyJSON = JSON.parse(correctedStoryRAW);
      const newContentState = convertFromRaw(storyJSON);
      setEditorState(EditorState.createWithContent(newContentState));
    })
  }

  useEffect(() => {
    getStory();
  }, [])

  // Like button toggle state
  const [storyLiked, setStoryLiked] = useState(false);
  // Like button error shown (true) if not logged in; links to log in page
  const [likeBtnError, setLikeBtnError] = useState(false);

  // Check if user has liked story already
  useEffect(() => {
    if (story && props.currentUser) {
      if (story.likes.includes(props.currentUser._id)) {
        setStoryLiked(true);
      } else {
        setStoryLiked(false);
      }
    }
  }, [story, props.currentUser])

  const onLikeButtonClick = () => {
    // User not logged in; prompt log in error message
    if (!props.currentUser) {
      setLikeBtnError(true)
    }
    // Story not liked; send like request to API
    if (props.currentUser && !storyLiked) {
      fetch(`http://localhost:8080/api/stories/${props.storyID}/likes`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      })
      .then(res => {
        return res.json();
      })
      .then(res => {
        setStoryLiked(true);
      });
    } else if (props.currentUser &&  storyLiked) { // Story already liked; send unlike request to API
      fetch(`http://localhost:8080/api/stories/${props.storyID}/likes`, {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      })
      .then(res => {
        return res.json();
      })
      .then(res => {
        setStoryLiked(false);
      });
    }
  }

  return (
    <Article >
      <DateContainer>
        {(story) ? <DateTag date={story.date} /> : null }
      </DateContainer>
      {(story) ? <Title >{story.title}</Title> : null }
      {(story) ? <AuthorLink to={`/user/${story.author._id}`}>{story.author.username}</AuthorLink> : null }
      <GenresContainer >
        {(story) ? 
          story.genres.map((genre) => {
            return <GenreTag key={genre._id} genre={genre} />
          })
        : null }
      </GenresContainer>
      <EditorWrapper>
        <Editor
          onChange={onChange}
          editorState={editorState}
          readOnly='true'
        />
      </EditorWrapper>
      <LikeButton onClick={onLikeButtonClick} isLiked={storyLiked} />
      {likeBtnError ? <LikeBtnErrorMessage to='/login'>Please log in to like stories!</LikeBtnErrorMessage> : null }
      {(story && props.currentUser && story.author._id === props.currentUser._id) ?
        <EditLink to={`/story/${story._id}/edit`} >Edit</EditLink>
      : null
      }
    </Article>
  );
}

export default Story;

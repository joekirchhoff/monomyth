import { React, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import LikeButton from './LikeButton';
import GenreTag from './GenreTag';
import DateTag from './DateTag';

const Article = styled.article`
  background-color: ${props => props.theme.bgMainColor};
  padding: 2rem 1rem;
  max-width: 750px;
  width: 100%;
  margin: 2rem auto;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  box-shadow: ${props => props.theme.boxShadowMain};
`

const EditorWrapper = styled.div`
  padding: 1rem;
  min-height: 15rem;
  background-color: ${props => props.theme.bgMainColor};
  font-weight: 300;
  margin-bottom: 2rem;
  line-height: 1.5rem;
`

const DateContainer = styled.span`
  text-align: center;
  display: grid;
  grid-template-columns: 8rem;
  justify-content: end;
`

const StoryErrorMessage = styled.span`
  text-align: center;
  color: ${props => props.theme.textWarningColor};
`

const Title = styled.h1`
  font-weight: 800;
  text-align: center;
  margin-top: .5rem;
  font-size: 3rem;
  @media (max-width: 415px) {
    font-size: 2rem;
  }
`

const AuthorLink = styled(Link)`
  padding: .75rem;
  font-size: 1.5rem;
  color: ${props => props.theme.textLinkColor};
  width: fit-content;
  margin: auto;
`

const GenresContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  border-top: ${props => props.theme.borderMain};
  border-bottom: ${props => props.theme.borderMain};
  margin: 1rem 0;
`

const LikeBtnLabel = styled.span`
  text-align: center;
  padding: .5rem;
  font-size: .9rem;
`

const LikeBtnErrorMessage = styled(Link)`
  font-size: 1rem;
  text-align: center;
  color: ${props => props.theme.textErrorColor};
  margin: .5rem;
`

const EditLink = styled(Link)`
  padding: .5rem;
  color: ${props => props.theme.textLinkColor};
  width: fit-content;
  margin-left: auto;
`

function Story(props) {

  const [storyError, setStoryError] = useState('');

  // On page load, get and store story data in state
  const [story, setStory] = useState(null)
  const [title, setTitle] = useState('')
  
  // On story load, title string is decoded from escaped user input
  const decodeTitle = () => {
    if (story) {
      // Temporary textarea used to interpret HTML entities
      const textarea = document.createElement('textarea');
      textarea.innerHTML = story.title;
      setTitle(textarea.value);
    }
  }

  useEffect(() => {
    decodeTitle();
  }, [story])
  
  // Story text rendered as a read-only Draft.js editor
  // to avoid additional third party dependencies
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );

  const onChange = (editorState) => {
      setEditorState(editorState)
    }

  const getStory = () => {
    fetch(`https://monomyth.herokuapp.com/api/stories/${props.storyID}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}, 
      credentials: 'include'
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      if (data.error) {
        // Error fetching story; set error message
        setStoryError(data.error.message);
      } else {
        // Successful load
        setStory(data);
        // Convert stored Draft.js text content from raw format
        const storyJSON = JSON.parse(data.text);
        const newContentState = convertFromRaw(storyJSON);
        setEditorState(EditorState.createWithContent(newContentState));
      }
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
      fetch(`https://monomyth.herokuapp.com/api/stories/${props.storyID}/likes`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      })
      .then(res => {
        return res.json();
      })
      .then(res => {
        if (res.error) {
          setLikeBtnError(true);
        } else {
          setStoryLiked(true);
        }
      });
    } else if (props.currentUser &&  storyLiked) { // Story already liked; send unlike request to API
      fetch(`https://monomyth.herokuapp.com/api/stories/${props.storyID}/likes`, {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      })
      .then(res => {
        return res.json();
      })
      .then(res => {
        if (res.error) {
          setLikeBtnError(true);
        } else {
          setStoryLiked(false);
        }
      });
    }
  }

  return (
    <Article >
      <StoryErrorMessage>{storyError}</StoryErrorMessage>
      <DateContainer>
        {(story) ? <DateTag date={story.date} /> : null }
      </DateContainer>
      {(story) ? <Title >{title}</Title> : null }
      {(story) ?
        <AuthorLink to={`/user/${story.author._id}`}>
          {story.author.username}
        </AuthorLink>
        : null
      }
      <GenresContainer >
        {(story) ? 
          story.genres.map((genre) => {
            return <GenreTag key={genre._id} genre={genre} />
          })
          : null
        }
      </GenresContainer>
      <EditorWrapper>
        <Editor
          onChange={onChange}
          editorState={editorState}
          readOnly='true'
        />
      </EditorWrapper>
      {(story) ? 
        <LikeButton
          onClick={onLikeButtonClick}
          isLiked={storyLiked}
        />
        : null
      }
      <LikeBtnLabel>Like Story</LikeBtnLabel>
      {likeBtnError ? <LikeBtnErrorMessage to='/login'>Please log in to like stories!</LikeBtnErrorMessage> : null }
      {(story && props.currentUser && story.author._id === props.currentUser._id) ?
        <EditLink to={`/story/${story._id}/edit`} >Edit</EditLink>
        : null
      }
    </Article>
  );
}

export default Story;

import { React, useRef, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';

const Article = styled.article`
  background-color: black;
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
  background-color: black;
  color: white;
`

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
`

const AuthorLink = styled(Link)`
  font-size: 1.5rem;
  text-align: center;
`

function Story(props) {

  // On page load, get and store story data in state
  const [story, setStory] = useState(null)
  
  // Story text rendered as a read-only Draft.js editor;
  // Because Draft.js does not provide native HTML output,
  // this is the cleanest solution that does not add
  // additional third-party plugin dependencies
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

  return (
    <Article >
      {(story) ? <Title >{story.title}</Title> : null }
      {(story) ? <AuthorLink to={`/user/${story.author._id}`}>{story.author.username}</AuthorLink> : null }
      <EditorWrapper>
        <Editor
          onChange={onChange}
          editorState={editorState}
          readOnly='true'
        />
      </EditorWrapper>
    </Article>
  );
}

export default Story;

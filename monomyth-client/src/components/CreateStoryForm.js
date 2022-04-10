import { React, useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import CreateStoryGenrePicker from './CreateStoryGenrePicker';

const Form = styled.form`
  background-color: slategray;
  max-width: 750px;
  width: 90%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding: 2rem;
  margin: 2rem auto;
`

const Header = styled.h1`
  font-size: 2rem;
  color: white;
  margin-bottom: 2rem;
`

const Label = styled.label`
  color: white;
`

const Input = styled.input`
  min-width: 200px;
  width: 90%;
  height: 2rem;
  border: none;
  margin-bottom: 1rem;
  padding-left: 1rem;
`

const StickyWrapper = styled.div`
  width: 90%;
  margin: auto;
`

const EditorWrapper = styled.div`
  padding: 1rem;
  min-height: 15rem;
  background-color: black;
  color: white;
`

const EditorToolbar = styled.div`
  position: sticky;
  /* TODO: top offset should exactly match navbar height, possibly calculated */
  top: 5rem;
  padding: .5rem;
  background-color: darkgray;
  z-index: 5;
`

const StyleButton = styled.button`

`

const SubmitBtn = styled.button`
  border: none;
  background-color: palevioletred;
  color: white;
  padding: 1rem;
  margin: 1rem;
  cursor: pointer;
  :disabled {
    background-color: darkgray;
  }
`

const ErrorPrompt = styled.p`
  color: red;
  margin-top: 1rem;
`

const RequiredPrompt = styled.p`
  color: white;
  margin-top: 1rem;
  font-size: 1rem;
`

function CreateStoryForm() {

  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e) => {
    
    e.preventDefault();

    // Get form body
    const editorJSON = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    const titleToSave = title;
    const genresToSave = genres;

    // Attempt to post story
    fetch('http://localhost:8080/api/stories', {
      method: "POST",
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify({
        'title': titleToSave,
        'text': editorJSON,
        'genres': genresToSave
      }),
      credentials: 'include'
    })
    .then(res => {
      return res.json();
    })
    .then(res => {
      if (!res.message) { // Successfully saved to database, redirect to new story page
        window.location.replace(`/story/${res}`);
      } else { // Something went wrong; update error message
        setErrorMessage(res.message);
      }
    });
  }

  // Draft.js Editor Config
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );

  const onChange = (editorState) => setEditorState(editorState);

  const draftEditor = useRef(null);

  const onEditorWrapperClick = () => {
    draftEditor.current.focus();
  }

  // Inline style keyboard controls
  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      onChange(newState);
      return 'handled';
    }

    return 'not-handled';
  }

  // Inline style UI button controls
  const onBoldClick = (e) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  }

  const onItalicClick = (e) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
  }

  const onUnderlineClick = (e) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
  }

  // Track genre selections as array of Genre ObjectIDs
  const [genres, setGenres] = useState([]);
  const [genreError, setGenreError] = useState('');

  const toggleCheck = (e) => {
    const index = genres.indexOf(e.target.id);
    const newGenres = [...genres];
    if (index === -1) { // Genre not found in array; attempt to add genre
      if (genres.length < 3) {
        newGenres.push(e.target.id);
        setGenres(newGenres);
      } else { // Max genres already selected, set error message
        setGenreError('Maximum of three genres selected; please unselect a genre first');
        e.target.checked = false;
      }
    }
    else { // Genre found in array; remove genre
      newGenres.splice(index, 1);
      setGenres(newGenres);
      setGenreError('');
    }
  }

  const [title, setTitle] = useState('');

  const onTitleChange = (e) => {
    setTitle(e.target.value);
  }

  // Disable submit button until all fields complete
  useEffect(() => {
    const submitBtn = document.getElementById('submit');
    if (genres.length === 3 && title.length > 0 && editorState.getCurrentContent().hasText()) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  }, [genres, title, editorState])

  return (
    <Form onSubmit={handleSubmit}>
      <Header >Create Story</Header>
      <Label htmlFor='title' >Title</Label>
      <Input id='title' type='text' name='title' value={title} onChange={onTitleChange}/>
      <StickyWrapper>
        <EditorToolbar >
          <StyleButton type='button' onMouseDown={ onBoldClick } >Bold</StyleButton>
          <StyleButton type='button' onMouseDown={ onItalicClick } >Italic</StyleButton>
          <StyleButton type='button' onMouseDown={ onUnderlineClick } >Underline</StyleButton>
        </EditorToolbar>
        <EditorWrapper onClick={onEditorWrapperClick}>
          <Editor
            editorState={editorState}
            handleKeyCommand={handleKeyCommand}
            onChange={onChange} 
            placeholder="Once upon a time..."
            ref={draftEditor}
          />
        </EditorWrapper>
      </StickyWrapper>
      <CreateStoryGenrePicker toggleCheck={toggleCheck} />
      {(genreError) ? <ErrorPrompt >{genreError}</ErrorPrompt> : null }
      {(errorMessage) ? <ErrorPrompt >{errorMessage}</ErrorPrompt> : null }
      <RequiredPrompt>All fields required</RequiredPrompt>
      <SubmitBtn id='submit' type='submit' disabled>Submit</SubmitBtn>
    </Form>
  );
}

export default CreateStoryForm;

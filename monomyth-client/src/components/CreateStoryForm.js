import { React, useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import CreateStoryGenrePicker from './CreateStoryGenrePicker';

const Form = styled.form`
  background-color: #222;
  max-width: 750px;
  width: 95%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  margin: 2rem auto;
`

const Header = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
`

const Label = styled.label`

`

const Input = styled.input`
  min-width: 200px;
  background-color: #111;
  width: 90%;
  height: 2rem;
  border: gray solid 1px;
  margin-bottom: 1rem;
  padding-left: .5rem;
  color: #eee;
`

const StickyWrapper = styled.div`
  width: 90%;
  margin: auto;
`

const EditorWrapper = styled.div`
  padding: 1rem;
  min-height: 15rem;
  background-color: #111;
  border: gray solid 1px;
  border-top: none;
`

const EditorToolbar = styled.ul`
  list-style: none;
  position: sticky;
  top: 3rem; // This value should match NavBar height
  padding: .5rem;
  background-color: #111;
  border: gray solid 1px;
  z-index: 5;
`

const StyleButton = styled.button`
  height: 2rem;
  width: 2rem;
  border: gray solid 1px;
  background-color: ${props => props.highlight ? '#444' : '#222'};
  color: #eee;
  margin-right: .5rem;
  font-weight: ${props => props.bold ? '1000' : 'inherit'};
  font-style: ${props => props.italic ? 'italic' : 'none'};
  text-decoration: ${props => props.underline ? 'underline' : 'none'};
`

const FormBtnList = styled.ul`
  display: flex;
  flex-flow: row nowrap;
  list-style: none;
  align-items: center;
`

const SubmitBtn = styled.button`
  border: none;
  background-color: #eee;
  color: #111;
  padding: 1rem;
  margin: 1rem;
  cursor: pointer;
  :disabled {
    background-color: darkgray;
  }
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

const ErrorPrompt = styled.p`
  color: firebrick;
  margin-top: 1rem;
`

const RequiredPrompt = styled.p`
  margin-top: 1rem;
  font-size: 1rem;
`

function CreateStoryForm() {

  const storyID = useParams().storyID;

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


  // Focus on editor if editor toolbar or wrapper are clicked
  const draftEditor = useRef(null);

  const onEditorWrapperClick = () => {
    draftEditor.current.focus();
  }

  const onEditorToolbarClick = (e) => {
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

  // Inline style UI button controls and highlighting
  const [boldHighlight, setBoldHightlight] = useState(false);
  const [italicHighlight, setItalicHighlight] = useState(false);
  const [underlineHighlight, setUnderlineHightlight] = useState(false);

  useEffect(() => {
    // Each time editorState changes (including cursor movement), check for inline
    // styles and highlight style buttons accordingly
    setBoldHightlight(editorState.getCurrentInlineStyle().has('BOLD'))
    setItalicHighlight(editorState.getCurrentInlineStyle().has('ITALIC'))
    setUnderlineHightlight(editorState.getCurrentInlineStyle().has('UNDERLINE'))
  }, [editorState])

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
      <Header >Create New Story</Header>
      <Label htmlFor='title' >Title</Label>
      <Input id='title' type='text' name='title' value={title} onChange={onTitleChange}/>
      <StickyWrapper>
        <EditorToolbar onMouseDown={onEditorToolbarClick} >
          <StyleButton highlight={boldHighlight} bold type='button' onMouseDown={ onBoldClick } >B</StyleButton>
          <StyleButton highlight={italicHighlight} italic type='button' onMouseDown={ onItalicClick } >I</StyleButton>
          <StyleButton highlight={underlineHighlight} underline type='button' onMouseDown={ onUnderlineClick } >U</StyleButton>
        </EditorToolbar>
        <EditorWrapper onClick={onEditorWrapperClick}>
          <Editor
            editorState={editorState}
            handleKeyCommand={handleKeyCommand}
            onChange={onChange} 
            placeholder="It was a dark and stormy night..."
            ref={draftEditor}
          />
        </EditorWrapper>
      </StickyWrapper>
      <CreateStoryGenrePicker toggleCheck={toggleCheck} />
      {(genreError) ? <ErrorPrompt >{genreError}</ErrorPrompt> : null }
      {(errorMessage) ? <ErrorPrompt >{errorMessage}</ErrorPrompt> : null }
      <RequiredPrompt>All fields required</RequiredPrompt>
      <FormBtnList>
        <li>
          <SubmitBtn id='submit' type='submit' disabled>Submit</SubmitBtn>
        </li>
        <li>
          <CancelBtn to={`/`} >Cancel</CancelBtn>
        </li>
      </FormBtnList>
    </Form>
  );
}

export default CreateStoryForm;

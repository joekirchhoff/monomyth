import { React, useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import CreateStoryGenrePicker from './CreateStoryGenrePicker';

const Form = styled.form`
  filter: ${props => props.showBlur ? 'blur(3px)' : 'none'};
  background-color: #222;
  max-width: 750px;
  width: 95%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  margin: 2rem auto;
  box-shadow:
    .25rem .5rem 1rem rgba(0, 0, 0, 0.3),
    0 0 1.5rem rgba(0, 0, 0, .2);
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
  color: #eee;
  width: 90%;
  height: 2rem;
  border: gray solid 1px;
  margin-bottom: 1rem;
  padding-left: .5rem;
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
  color: red;
  margin-top: 1rem;
`

const RequiredPrompt = styled.p`
  margin-top: 1rem;
  font-size: 1rem;
`

function EditStoryForm(props) {

  const storyID = useParams().storyID;

  const [errorMessage, setErrorMessage] = useState('')

  // Title handling
  const [title, setTitle] = useState('');
  const onTitleChange = (e) => {
    setTitle(e.target.value);
  }

  // Track genre selections as array of Genre IDs
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
  
  // Draft.js Editor Config
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );

  const onChange = (editorState) => setEditorState(editorState);

  // Get initial story data for populating form
  const [story, setStory] = useState();
  const getStory = () => {
    fetch(`http://localhost:8080/api/stories/${storyID}`, {
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
      // Populate editor with story text
      setEditorState(EditorState.createWithContent(newContentState));
      // Populate title
      setTitle(data.title);
      // Populate genre checkboxes
      data.genres.forEach((genre) => {
        document.getElementById(genre._id).checked = true;
        genres.push(genre._id);
      })
    })
  }

  // Load initial story data on component mount
  useEffect(() => {
    getStory();
  }, [])

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

  // Disable submit button until all fields complete
  useEffect(() => {
    const submitBtn = document.getElementById('submit');
    if (genres.length === 3 && title.length > 0 && editorState.getCurrentContent().hasText()) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  }, [genres, title, editorState])

  // Submit handler
  const handleSubmit = (e) => {
    
    e.preventDefault();

    // Get form body
    const editorJSON = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    const titleToSave = title;
    const genresToSave = genres;

    // Attempt to update story
    fetch(`http://localhost:8080/api/stories/${storyID}`, {
      method: "PUT",
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
      if (!res.message) { // Successfully updated to database, redirect to story page
        window.location.replace(`/story/${storyID}`);
      } else { // Something went wrong; update error message
        setErrorMessage(res.message);
      }
    });
  }

  return (
    <Form onSubmit={handleSubmit} showBlur={props.showBlur} >
      <Header >Edit Story</Header>
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
            placeholder="Once upon a time..."
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
          <CancelBtn to={`/story/${storyID}`} >Cancel</CancelBtn>
        </li>
      </FormBtnList>
    </Form>
  );
}

export default EditStoryForm;

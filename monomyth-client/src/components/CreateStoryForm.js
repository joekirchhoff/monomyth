import { React, useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import CreateStoryGenrePicker from './CreateStoryGenrePicker';

const Form = styled.form`
  background-color: ${props => props.theme.bgMainColor};
  max-width: 750px;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.boxShadowMain};
`

const Header = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
`

const Label = styled.label`
  font-size: 1.25rem;
  padding-bottom: .25rem;
  user-select: none;
`

const Input = styled.input`
  min-width: 200px;
  background-color: ${props => props.theme.inputBgColor};
  color: ${props => props.theme.inputTextColor};
  border: ${props => props.theme.borderMain};
  width: 100%;
  height: 2rem;
  padding-left: .5rem;
  font-size: 1.1rem;
`

const StickyWrapper = styled.div`
  width: 100%;
  margin: auto;
`

const EditorWrapper = styled.div`
  padding: 1rem;
  min-height: 15rem;
  background-color: ${props => props.theme.inputBgColor};
  border: ${props => props.theme.borderMain};
  border-top: none;
`

const EditorToolbar = styled.ul`
  list-style: none;
  position: sticky;
  top: 3rem; // This value should match NavBar height
  padding: .5rem;
  background-color: ${props => props.theme.inputBgColor};
  border: ${props => props.theme.borderMain};
  z-index: 5;
`

const StyleButton = styled.button`
  height: 2rem;
  width: 2rem;
  border: ${props => props.highlight ? props.theme.borderHighlight : props.theme.borderMain};
  background-color: ${props => props.highlight ? props.theme.bgHighlightColor : props.theme.bgMainColor};
  color: ${props => props.theme.textMainColor};
  margin-right: .5rem;
  font-weight: ${props => props.bold ? '1000' : 'inherit'};
  font-style: ${props => props.italic ? 'italic' : 'none'};
  text-decoration: ${props => props.underline ? 'underline' : 'none'};
  :hover {
    background-color: ${props => props.theme.bgHighlightColor};
  }
`

const FormBtnList = styled.ul`
  display: flex;
  flex-flow: row nowrap;
  list-style: none;
  align-items: center;
`

const SubmitBtn = styled.button`
  border: none;
  background-color: ${props => props.theme.btnPrimaryBgColor};
  color: ${props => props.theme.btnPrimaryTextColor};
  padding: 1rem;
  margin: 1rem;
  cursor: pointer;
  :disabled {
    background-color: ${props => props.theme.btnDisabledBgColor};
    color: ${props => props.theme.btnDisabledTextColor};
  }
`

const CancelBtn = styled(Link)`
  border: ${props => props.theme.borderMain};
  background-color: ${props => props.theme.btnCancelBgColor};
  color: ${props => props.theme.btnCancelTextColor};
  padding: 1rem;
  margin: 1rem;
  cursor: pointer;
`

const ErrorMessage = styled.span`
  color: ${props => props.theme.textWarningColor};
  margin-bottom: 1rem;
`

const RequiredPrompt = styled.span`
  margin-top: 1rem;
  font-size: 1rem;
`

function CreateStoryForm() {

  // Error messaging
  const [titleError, setTitleError] = useState('')
  // Submit error can be either string (custom error) or array of error objects (from express-validator)
  const [submitError, setSubmitError] = useState()

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
        'genres': genresToSave,
        'editorIsValid': editorState.getCurrentContent().hasText().toString()
      }),
      credentials: 'include'
    })
    .then(res => {
      return res.json();
    })
    .then(res => {
      if (res.validationErrors) {

        // Server returned validation error array; set error messages
        setSubmitError(res.validationErrors.errors);

      } else if (res.authError) {

        // Server returned auth error; user not logged in
        setSubmitError(res.authError);

      } else {
        // Successfully saved to database, redirect to new story page
        window.location.replace(`/story/${res}`);
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
        setGenreError('Maximum of three genres already selected');
        e.target.checked = false;
      }
    }
    else { // Genre found in array; remove genre
      newGenres.splice(index, 1);
      setGenres(newGenres);
      setGenreError('');
    }
  }

  // Title validation and tracking
  const [title, setTitle] = useState('');

  const onTitleChange = (e) => {
    setTitle(e.target.value);
  }

  const onTitleBlur = () => {
    if (!title.length) {
      setTitleError('Please enter a title')
    } else {
      setTitleError('');
    }
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
      <Input
        id='title'
        type='text'
        name='title'
        value={title}
        onChange={onTitleChange}
        onBlur={onTitleBlur}
        required
      />
      <ErrorMessage>{titleError}</ErrorMessage>
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
      <ErrorMessage >{genreError}</ErrorMessage>
      <RequiredPrompt>All fields required</RequiredPrompt>
      <FormBtnList>
        <li>
          <SubmitBtn id='submit' type='submit' disabled>Submit</SubmitBtn>
        </li>
        <li>
          <CancelBtn to={`/`} >Cancel</CancelBtn>
        </li>
      </FormBtnList>
      {(Array.isArray(submitError)) ?
        submitError.map(error => {
          return <ErrorMessage key={error.msg}>{error.msg}</ErrorMessage>
        })
        : <ErrorMessage >{submitError}</ErrorMessage>
      }
    </Form>
  );
}

export default CreateStoryForm;

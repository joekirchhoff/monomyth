import { useEffect, useState } from 'react';
import styled from 'styled-components';

const SortForm = styled.form`
  width: 90%;
  max-width: 450px;
  margin: 1rem auto 2rem auto;
  display: flex;
  flex-flow: column nowrap;
  box-shadow: ${props => props.theme.boxShadowMain};
`

const OpenMenuBtn = styled.button`
  flex: 1;
  background-color: ${props => props.highlight ? props.theme.bgHighlightColor : props.theme.bgMainColor };
  color: ${props => props.theme.textMainColor};
  border: ${props => props.theme.borderMain};
  padding: .5rem 0;
  cursor: pointer;
`

const GenreMenu = styled.div`
  display: ${props => props.open ? 'flex' : 'none'};
  flex-flow: column nowrap;
  align-items: center;
  border: ${props => props.theme.borderMain};
  background-color: ${props => props.theme.bgDarkColor};

`

const GenreFieldset = styled.fieldset`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: .5rem 0;
  border-top: none;
  width: 100%;
`

const FieldContainer = styled.div`
  padding: .25rem 0 0 1rem;
  display: flex;
  align-items: center;
`

const CheckboxLabel = styled.label`
  padding-left: .25rem;
  user-select: none;
  cursor: pointer;
`

const GenreCheckbox = styled.input`
  accent-color: ${props => props.genreColor};
  height: 1.25rem;
  width: 1.25rem;
`

const ErrorMessage = styled.span`
  text-align: center;
  padding: 1rem;
  grid-column: 1 / 3;
  color: ${props => props.theme.textWarningColor};
`

const ClearBtn = styled.button`
  margin: auto;
  border: ${props => props.theme.borderMain};
  background-color: ${props => props.theme.btnCancelBgColor};
  color: ${props => props.theme.btnCancelTextColor};
  padding: 1rem;
  margin: 1rem;
  cursor: pointer;
`

function GenreFilter(props) {

  // Fetch error handling
  const [fetchError, setFetchError] = useState('');

  // Genre options from database
  const [genreOptions, setGenreOptions] = useState([]);

  const getGenreOptions = () => {

    fetch('http://localhost:8080/api/genres', { 
      method: "GET",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then(res => {
      return res.json();
    })
    .then(res => {
      if (res.err) {
        // Error fetching genres; set error message
        setFetchError(res.err);
      } else {
        // Success; list genres
        setGenreOptions(res);
      }
    })
  }

  useEffect(() => {
    getGenreOptions();
  }, [])

  // Time menu open toggle
  const [menuOpen, setMenuOpen] = useState(false);

  const onOpenMenuBtnClick = ((e) => {
    e.preventDefault();
    setMenuOpen(!menuOpen);
  })

  return (
    <SortForm>
      <OpenMenuBtn highlight={props.selectedGenres.length} onClick={onOpenMenuBtnClick} >Genre Filter ˅</OpenMenuBtn>
      <GenreMenu open={menuOpen}>
        <GenreFieldset>
        {genreOptions.map((genre) => {
          return (
            <FieldContainer key={genre._id}>
              <GenreCheckbox
                type="checkbox"
                id={genre._id}
                name={genre._id}
                genreColor={genre.color}
                onChange={props.toggleGenre}
              />
              <CheckboxLabel htmlFor={genre._id} >{genre.name}</CheckboxLabel>
            </FieldContainer>
          )
        })}
        {fetchError ? <ErrorMessage>{fetchError}</ErrorMessage> : null}
        {props.genreError ? <ErrorMessage>{props.genreError}</ErrorMessage> : null}
        </GenreFieldset>
        <ClearBtn onClick={props.clearGenres} >Clear Selection</ClearBtn>
      </GenreMenu>
    </SortForm>
  );
}

export default GenreFilter;

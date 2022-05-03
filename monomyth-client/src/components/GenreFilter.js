import { useEffect, useState } from 'react';
import styled from 'styled-components';

const SortForm = styled.form`
  width: 90%;
  max-width: 450px;
  margin: 1rem auto 2rem auto;
  display: flex;
  flex-flow: column nowrap;
  box-shadow:
    .25rem .5rem 1rem rgba(0, 0, 0, 0.3),
    0 0 1.5rem rgba(0, 0, 0, .2);
`

const OpenMenuBtn = styled.button`
  flex: 1;
  background-color: ${props => props.highlight ? '#444' : '#222' };
  color: #eee;
  border: gray solid 1px;
  padding: .5rem 0;
  cursor: pointer;
`

const GenreMenu = styled.fieldset`
  display: ${props => props.open ? 'grid' : 'none'};
  grid-template-columns: repeat(2, 1fr);
  padding: .5rem 0;
  border: gray solid 1px;
  border-top: none;
  background-color: #111;
`

const FieldContainer = styled.div`
  padding-left: 1.5rem;
`

const CheckboxLabel = styled.label`
  color: #eee;
`

const GenreCheckbox = styled.input`

`

const GenreErrorMessage = styled.p`
  padding: 1rem;
  grid-column: 1 / 3;
`

function GenreFilter(props) {

  // Genre options from database
  const [genreOptions, setGenreOptions] = useState([]);

  const getGenreOptions = () => {

    fetch('http://localhost:8080/api/genres', { 
      method: "GET",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      setGenreOptions(response);
    })
    .catch(function(err) {
      // Error
      if (err) console.log(err);
    });
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
        {genreOptions.map((genre) => {
          return <FieldContainer key={genre._id}>
            <GenreCheckbox type="checkbox" id={genre._id} name={genre._id} onChange={props.toggleGenre}/>
            <CheckboxLabel htmlFor={genre._id} >{genre.name}</CheckboxLabel>
          </FieldContainer>
        })}
        {props.genreError ? <GenreErrorMessage>{props.genreError}</GenreErrorMessage> : null}
      </GenreMenu>
    </SortForm>
  );
}

export default GenreFilter;

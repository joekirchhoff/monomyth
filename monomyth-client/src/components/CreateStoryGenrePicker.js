import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Fieldset = styled.fieldset`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: ${props => props.theme.borderMain};
  padding: 1rem;
  gap: .25rem;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 403px) {
    grid-template-columns: 1fr;
  }
`

const Legend = styled.legend`
  font-size: 1.5rem;
  margin: 1rem auto 0 auto;
  padding: 0 .5rem;
`

const FieldContainer = styled.div`
  padding: .25rem 0 0 1rem;
  display: flex;
  align-items: center;
`

const Label = styled.label`
  padding-left: .25rem;
  user-select: none;
  cursor: pointer;
`

const Input = styled.input`
  accent-color: ${props => props.genreColor};
  height: 1.25rem;
  width: 1.25rem;
`

const ErrorMessage = styled.p`
  color: ${props => props.theme.textWarningColor};
`

function CreateStoryGenrePicker(props) {

  const [showError, setShowError] = useState(false)

  // Get current genre list from backend
  const [genres, setGenres] = useState([]);

  const getGenres = () => {

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
      setGenres(response);
    })
    .catch(function(err) {
      // Error
      if (err) console.log(err);
    });
  }

  useEffect(() => {
    getGenres();
  }, [])  

  return (
    <Fieldset>
      <Legend >Please select three (3) genres</Legend>

      {genres.map((genre) => {
        return <FieldContainer key={genre._id}>
          <Input
            type="checkbox"
            id={genre._id}
            name={genre._id}
            onChange={props.toggleCheck}
            genreColor={genre.color}
          />
          <Label htmlFor={genre._id} >{genre.name}</Label>
        </FieldContainer>
      })}

      {(showError) ? <ErrorMessage >Please select exactly three (3) genres</ErrorMessage> : null }
    </Fieldset>
  );
}

export default CreateStoryGenrePicker;

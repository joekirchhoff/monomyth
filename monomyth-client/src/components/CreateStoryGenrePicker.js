import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Fieldset = styled.fieldset`
  width: 90%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: solid white 1px;
  padding: 1rem;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 403px) {
    grid-template-columns: 1fr;
  }
`

const Legend = styled.legend`
  font-size: 1.5rem;
  color: white;
  margin: 1rem auto 0 auto;
`

const Label = styled.label`
  color: white;
`

const Input = styled.input`

`

const ErrorMessage = styled.p`
  color: red;
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
        return <div key={genre._id}>
          <Input type="checkbox" id={genre._id} name={genre._id} onChange={props.toggleCheck}/>
          <Label htmlFor={genre._id} >{genre.name}</Label>
        </div>
      })}

      {(showError) ? <ErrorMessage >Please select exactly three (3) genres</ErrorMessage> : null }
    </Fieldset>
  );
}

export default CreateStoryGenrePicker;

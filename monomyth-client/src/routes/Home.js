import { React, useEffect, useState } from 'react';
import styled from 'styled-components';
import GenreFilter from '../components/GenreFilter';
import PageControl from '../components/PageControl';
import StoryCard from '../components/StoryCard';
import StorySorter from '../components/StorySorter';

const HomeContainer = styled.div`
  flex: 1;
`

const ErrorMessage = styled.p`
  text-align: center;
  margin: 2rem;
  font-size: 1.5rem;
`

const CardList = styled.div`
  max-width: 750px;
  display: flex;
  flex-flow: column nowrap;
  margin: auto;
`

function Home(props) {

  // Scroll to top of page on render
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Error messaging
  const [errorMessage, setErrorMessage] = useState('');

  // Get story cards
  const [stories, setStories] = useState([]);

  // Story sorting and filtering parameters
  const [sortMethod, setSortMethod] = useState('score');
  const [dateLimit, setDateLimit] = useState(0);

  // Pagination of story request
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const getStories = () => {

    // Initialize query string params object
    const URLParamsObject = {
      sort: sortMethod,
      date: dateLimit,
      page: page,
      limit: pageSize,
    }

    // Add up to three genre filters to params if selected
    if (selectedGenres[0]) {
      URLParamsObject.firstGenre = selectedGenres[0];
    }
    if (selectedGenres[1]) {
      URLParamsObject.secondGenre = selectedGenres[1];
    }
    if (selectedGenres[2]) {
      URLParamsObject.thirdGenre = selectedGenres[2];
    }

    // Convert params object to valid URL string query
    const URLParamsString = new URLSearchParams(URLParamsObject);

    // Get stories with complete set of string queries
    fetch('http://localhost:8080/api/stories?' + URLParamsString, { 
      method: "GET",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      setStories(response);
    })
    .catch(function(err) {
      if (err) setErrorMessage(err);
    });
  }
  
  // Genre filtering; genres stored as MongoDB ObjectID, listed on genre checkbox element ID
  const [selectedGenres, setSelectedGenres] = useState([])
  const [genreError, setGenreError] = useState('');
  
  const toggleGenre = (e) => {
    const index = selectedGenres.indexOf(e.target.id);
    const newGenres = [...selectedGenres];
    if (index === -1) { // Genre not found in array; attempt to add genre
      if (selectedGenres.length < 3) {
        newGenres.push(e.target.id);
        setSelectedGenres(newGenres);
      } else { // Max genres already selected, set error message
        setGenreError('Maximum of three genres selected; please unselect a genre first');
        e.target.checked = false;
      }
    }
    else { // Genre found in array; remove genre
      newGenres.splice(index, 1);
      setSelectedGenres(newGenres);
      setGenreError('');
    }
  }

  const clearGenres = (e) => {
    e.preventDefault(e);

    // Get all genre checkboxes
    const fieldset = e.target.parentElement.firstChild;
    const fieldsetDivs = [...fieldset.childNodes];
    let fieldsetCheckboxes = [];
    fieldsetDivs.forEach(div => fieldsetCheckboxes.push(div.firstChild));

    // Uncheck all checkboxes and clear genre selection state
    fieldsetCheckboxes.forEach(checkbox => checkbox.checked = false)
    setSelectedGenres([]);
  }
  
  useEffect(() => {
    getStories();
  }, [selectedGenres, page, pageSize, sortMethod, dateLimit])

  return (
    <HomeContainer>
      {(errorMessage) ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
      <StorySorter
        sortMethod={sortMethod}
        setSortMethod={setSortMethod}
        dateLimit={dateLimit}
        setDateLimit={setDateLimit}
      />
      <GenreFilter
        selectedGenres={selectedGenres}
        toggleGenre={toggleGenre}
        genreError={genreError}
        clearGenres={clearGenres}
      />
      {(stories.length) ?
        <CardList >
          {stories.map((story) => {
            return <StoryCard key={story._id} story={story} currentUser={props.currentUser} />
          })}
        </CardList>
      : <ErrorMessage>Sorry, no stories found! Try adjusting filters or returning to an earlier page.</ErrorMessage>
      }
      <PageControl page={page} setPage={setPage} />
    </HomeContainer>
  );
}

export default Home;

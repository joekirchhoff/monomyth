import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import StoryCard from '../components/StoryCard';
import PageControl from '../components/PageControl';
import SearchFieldSwitch from '../components/SearchFieldSwitch';

const PageContainer = styled.div`
  flex: 1;
`

const ErrorMessage = styled.p`
  text-align: center;
  color: white;
  margin: 2rem;
  font-size: 1.5rem;
`

const Header = styled.h1`
  padding: 2rem;
  font-size: 2rem;
  color: white;
  text-align: center;
`

const CardList = styled.div`
  max-width: 750px;
  display: flex;
  flex-flow: column nowrap;
  margin: auto;
`

const SearchPage = (props) => {

  // Scroll to top of page on render
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Error messaging
  const [errorMessage, setErrorMessage] = useState('');

  // Get story cards
  const [stories, setStories] = useState([]);

  // Pagination of story request
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Get query text from URL param (set by NavBar search element)
  const query = useParams().query;

  // Story field to query (whitelisted by API: 'title' or 'text')
  const [field, setField] = useState('title');

  // Initialize query string params object, convert to URL params
  const URLParamsObject = {
    query: query,
    field: field,
    page: page,
    limit: pageSize,
  }

  const URLParamsString = new URLSearchParams(URLParamsObject);

  // Fetch stories from search results
  const getStories = () => {
    fetch('http://localhost:8080/api/stories/search?' + URLParamsString, { 
      method: "GET",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(stories) {
      // Format author field; search method returns author as one-length array
      stories.forEach((story) => {
        story.author = story.author[0];
      })
      setStories(stories);
    })
    .catch(function(err) {
      if (err) setErrorMessage(err);
    });
  }

  useEffect(() => {
    getStories();
  }, [field, page, pageSize])

  return (
    <PageContainer>
      <Header>Search Results</Header>
      <SearchFieldSwitch setField={setField} />
      {/* {(errorMessage) ? <ErrorMessage>{errorMessage}</ErrorMessage> : null} */}
      {(stories.length) ?
        <CardList>
          {stories.map((story) => {
            return <StoryCard key={story._id} story={story} currentUser={props.currentUser} />
          })}
        </CardList>
        : <ErrorMessage>Sorry, no stories found! Try changing search text or query field.</ErrorMessage>
      }
      <PageControl page={page} setPage={setPage} />
    </PageContainer>
  )
}

export default SearchPage
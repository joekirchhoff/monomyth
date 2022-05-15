import styled from 'styled-components';
import { useState, useEffect } from 'react';
import StoryCard from '../components/StoryCard';
import PageControl from '../components/PageControl';
import SearchFieldSwitch from '../components/SearchFieldSwitch';

const PageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
`

const ErrorMessage = styled.span`
  text-align: center;
  font-size: 1.5rem;
`

const Header = styled.h1`
  padding: 2rem;
  font-size: 2rem;
  text-align: center;
`

const CardList = styled.div`
  width: 100%;
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
  const URLString = window.location.search;
  const URLParams = new URLSearchParams(URLString);
  const query = URLParams.get('q');

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
    fetch('https://monomyth.herokuapp.com/api/stories/search?' + URLParamsString, { 
      method: "GET",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      if (data.error) {
        setErrorMessage(data.error);
      } else {
        // Format author field; search method returns author as one-length array
        data.forEach((story) => {
          story.author = story.author[0];
        })
        setStories(data);
      }
    })
  }

  useEffect(() => {
    getStories();
  }, [field, page, pageSize])

  return (
    <PageContainer>
      <Header>Search Results: "{query}"</Header>
      <SearchFieldSwitch setField={setField} />
      <ErrorMessage>{errorMessage}</ErrorMessage>
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
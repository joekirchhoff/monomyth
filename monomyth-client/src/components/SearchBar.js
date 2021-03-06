import styled from 'styled-components';
import { useState } from 'react';

const SearchForm = styled.form`
  flex: 1;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  border-radius: 10rem;
  max-width: 20rem;
  border: ${props => props.theme.borderMain};
  background-color: ${props => props.theme.inputBgColor};
  padding: 0 .5rem 0 1rem;
  :focus-within {
    outline: #eee solid 1px;
  }
`

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  color: ${props => props.theme.inputTextColor};
  :focus {
    outline: none;
  }
`

const SearchBtn = styled.button`
  width: 2rem;
  height: 2rem;
  border: none;
  background-color: transparent;
  cursor: pointer;
`

const SearchBar = () => {

  // Track search input value in state
  const [searchValue, setSearchValue] = useState('');
  const onSearchValueChange = (e) => {
    setSearchValue(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // UTF-8 encode query to avoid confusing React Router with "/"
    const encodedQuery = encodeURIComponent(searchValue);

    // Redirect to search results
    window.location.assign(`/search/?q=${encodedQuery}`);
  }

  return (
    <SearchForm>
      <SearchInput
        value={searchValue}
        onChange={onSearchValueChange}
        type='search'
        placeholder='Search stories'
        aria-label='search stories'
        size='12'
      />
      <SearchBtn aria-label='search submit' type='submit' onClick={handleSubmit} >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          aria-hidden={true}
        >
          <title>Search</title>
          <path
            d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
            fill="none"
            stroke="#eee"
            strokeMiterlimit="10"
            strokeWidth="32"
          />
          <path
            fill="none"
            stroke="#eee"
            strokeLinecap="round"
            strokeMiterlimit="10"
            strokeWidth="32"
            d="M338.29 338.29L448 448"
          />
        </svg>
      </SearchBtn>
    </SearchForm>
  )
}

export default SearchBar
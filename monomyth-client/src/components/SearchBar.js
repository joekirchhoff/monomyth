import styled from 'styled-components';
import { useState } from 'react';

const SearchForm = styled.form`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
`

const SearchInput = styled.input`
  flex: 1;
  padding: .25rem .75rem;
  border-radius: 10rem;
  margin-right: .5rem;
  max-width: 20rem;
  border: gray solid 1px;
  background-color: #111;
  color: white;
`

const SearchBtn = styled.button`
  border: none;
  background-color: #222;
  cursor: pointer;
  font-size: 1.5rem;
`

const SearchBar = () => {

  // Track search input value in state
  const [searchValue, setSearchValue] = useState('');
  const onSearchValueChange = (e) => {
    setSearchValue(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.assign(`/search/${searchValue}`);
  }

  return (
    <SearchForm>
      <SearchInput
        value={searchValue}
        onChange={onSearchValueChange}
        type='search'
        placeholder='Search by title or text'
      />
      <SearchBtn onClick={handleSubmit} >🔍</SearchBtn>
    </SearchForm>
  )
}

export default SearchBar
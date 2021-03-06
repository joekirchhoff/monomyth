import { useState } from 'react';
import styled from 'styled-components';

const FieldSwitch = styled.form`
  width: 90%;
  max-width: 450px;
  margin: 0 auto 2rem auto;
  display: flex;
  flex-flow: row nowrap;
  border: ${props => props.theme.borderMain};
  box-shadow: ${props => props.theme.boxShadowMain};
`

const TabBtn = styled.button`
  flex: 1;
  background-color: ${props => props.highlight ? props.theme.bgHighlightColor : props.theme.bgMainColor};
  color: ${props => props.theme.textMainColor};
  padding: .5rem 0;
  border: none;
  border-right: ${props => props.left ? 'gray solid .5px' : null};
  border-left: ${props => props.right ? 'gray solid .5px' : null};
  cursor: pointer;
`

function SearchFieldSwitch(props) {

  // Button highlight handlers
  const [titleHighlight, setTitleHighlight] = useState(true);
  const [textHighlight, setTextHighlight] = useState(false);

  // Clear all highlighting (to prevent even more highlighting code repetition)
  const clearHighlights = () => {
    setTitleHighlight(false);
    setTextHighlight(false);
  }

  // Button handlers -- sort by score (top) vs. date (new)
  const onTitleClick = ((e) => {
    e.preventDefault();

    props.setField('title');

    clearHighlights();
    setTitleHighlight(true);
  })

  // Sort by new button handler
  const onTextClick = ((e) => {
    e.preventDefault();

    props.setField('text');
    
    clearHighlights();
    setTextHighlight(true);
  })

  return (
    <FieldSwitch>
      <TabBtn left highlight={titleHighlight} onClick={onTitleClick} >Title</TabBtn>
      <TabBtn right highlight={textHighlight} onClick={onTextClick}>Text</TabBtn>
    </FieldSwitch>
  );
}

export default SearchFieldSwitch;

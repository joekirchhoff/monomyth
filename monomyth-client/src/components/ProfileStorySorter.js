import { useEffect, useState } from 'react';
import styled from 'styled-components';

const SortForm = styled.form`
  width: 90%;
  max-width: 450px;
  margin: 0 auto 2rem auto;
  display: flex;
  flex-flow: row nowrap;
  border: gray solid 2px;
`

const TabBtn = styled.button`
  flex: 1;
  background-color: ${props => props.highlight ? '#444' : '#222'};
  color: white;
  padding: .5rem 0;
  border: none;
  border-right: ${props => props.left ? 'gray solid 1px' : null};
  border-left: ${props => props.right ? 'gray solid 1px' : null};
  cursor: pointer;
`

function ProfileStorySorter(props) {

  // Button highlight handlers
  const [topHighlight, setTopHighlight] = useState(true);
  const [newHighlight, setNewHighlight] = useState(false);

  // Clear all highlighting (to prevent even more highlighting code repetition)
  const clearHighlights = () => {
    setTopHighlight(false);
    setNewHighlight(false);
  }

  // Button handlers -- sort by score (top) vs. date (new)
  const onTopClick = ((e) => {
    e.preventDefault();

    props.setStorySortMethod('score');

    clearHighlights();
    setTopHighlight(true);
  })

  // Sort by new button handler
  const onNewClick = ((e) => {
    e.preventDefault();

    props.setStorySortMethod('date');
    
    clearHighlights();
    setNewHighlight(true);
  })

  return (
    <SortForm>
      <TabBtn left highlight={topHighlight} onClick={onTopClick} >Top</TabBtn>
      <TabBtn right highlight={newHighlight} onClick={onNewClick}>New</TabBtn>
    </SortForm>
  );
}

export default ProfileStorySorter;
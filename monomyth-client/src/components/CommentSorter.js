import { useState } from 'react';
import styled from 'styled-components';

const SortForm = styled.form`
  width: 90%;
  max-width: 450px;
  margin: 1rem auto;
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
  border-right: ${props => props.left ? 'gray solid .5px' : 'none'};
  border-left: ${props => props.right ? 'gray solid .5px' : 'none'};
  cursor: pointer;
`

function CommentSorter(props) {

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

    props.setCommentSortMethod('score');

    clearHighlights();
    setTopHighlight(true);
  })

  // Sort by new button handler
  const onNewClick = ((e) => {
    e.preventDefault();

    props.setCommentSortMethod('date');
    
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

export default CommentSorter;

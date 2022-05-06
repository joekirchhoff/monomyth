import { useState } from 'react';
import styled from 'styled-components';

const SortForm = styled.form`
  width: 90%;
  max-width: 450px;
  margin: 2rem auto 0 auto;
  display: flex;
  flex-flow: column nowrap;
`

const TabBtnContainer = styled.div`
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

const TimeMenu = styled.div`
  width: calc(50% + .5px); // Keeps right border aligned with tab buttons
  display: flex;
  flex-flow: column nowrap;
  padding: .5rem 1rem;
  border: ${props => props.theme.borderMain};
  border-top: none;
  background-color: ${props => props.theme.bgDarkColor};
  box-shadow: ${props => props.theme.boxShadowMain};
`

const TimeOptionBtn = styled.button`
  padding: .5rem;
  margin: .5rem 0;
  background-color: ${props => props.highlight ? props.theme.bgHighlightColor : props.theme.bgMainColor};
  color: ${props => props.theme.textMainColor};
  border: ${props => props.theme.borderMain};
  cursor: pointer;
`

function StorySorter(props) {

  // Time menu open toggle
  const [timeMenuOpen, setTimeMenuOpen] = useState(false);

  const onTopTabClick = ((e) => {
    e.preventDefault();
    setTimeMenuOpen(!timeMenuOpen);
  })

  // Button highlight handlers
  const [topHighlight, setTopHighlight] = useState(true);
  const [dayHighlight, setDayHighlight] = useState(false);
  const [weekHighlight, setWeekHighlight] = useState(false);
  const [monthHighlight, setMonthHighlight] = useState(false);
  const [yearHighlight, setYearHighlight] = useState(false);
  const [allTimeHighlight, setAllTimeHighlight] = useState(true);
  const [newHighlight, setNewHighlight] = useState(false);

  // Clear all highlighting (to prevent even more highlighting code repetition)
  const clearHighlights = () => {
    setTopHighlight(false);
    setDayHighlight(false);
    setWeekHighlight(false);
    setMonthHighlight(false);
    setYearHighlight(false);
    setAllTimeHighlight(false);
    setNewHighlight(false);
  }

  // Button handlers -- sort by score (various time filter options)
  const onDayClick = ((e) => {
    e.preventDefault();

    props.setSortMethod('score');
    props.setDateLimit(1);

    clearHighlights();
    setDayHighlight(true);
    setTopHighlight(true);
  })

  const onWeekClick = ((e) => {
    e.preventDefault();

    props.setSortMethod('score');
    props.setDateLimit(7);

    clearHighlights();
    setWeekHighlight(true);
    setTopHighlight(true);
  })

  const onMonthClick = ((e) => {
    e.preventDefault();

    props.setSortMethod('score');
    props.setDateLimit(31);

    clearHighlights();
    setMonthHighlight(true);
    setTopHighlight(true);
  })

  const onYearClick = ((e) => {
    e.preventDefault();

    props.setSortMethod('score');
    props.setDateLimit(365);

    clearHighlights();
    setYearHighlight(true);
    setTopHighlight(true);
  })

  const onAllTimeClick = ((e) => {
    e.preventDefault();

    props.setSortMethod('score');
    props.setDateLimit(0);

    clearHighlights();
    setAllTimeHighlight(true);
    setTopHighlight(true);
  })

  // Sort by new button handler
  const onNewClick = ((e) => {
    e.preventDefault();

    props.setSortMethod('date');
    props.setDateLimit(0);
    
    clearHighlights();
    setNewHighlight(true);
  })

  return (
    <SortForm>
      <TabBtnContainer>
        <TabBtn left highlight={topHighlight} onClick={onTopTabClick} >Top ˅</TabBtn>
        <TabBtn right highlight={newHighlight} onClick={onNewClick}>New</TabBtn>
      </TabBtnContainer>
      {timeMenuOpen ?
        <TimeMenu>
          <TimeOptionBtn highlight={dayHighlight} onClick={onDayClick}>Day</TimeOptionBtn>
          <TimeOptionBtn highlight={weekHighlight} onClick={onWeekClick}>Week</TimeOptionBtn>
          <TimeOptionBtn highlight={monthHighlight} onClick={onMonthClick}>Month</TimeOptionBtn>
          <TimeOptionBtn highlight={yearHighlight} onClick={onYearClick}>Year</TimeOptionBtn>
          <TimeOptionBtn highlight={allTimeHighlight} onClick={onAllTimeClick}>All Time</TimeOptionBtn>
        </TimeMenu>
      : null }
    </SortForm>
  );
}

export default StorySorter;

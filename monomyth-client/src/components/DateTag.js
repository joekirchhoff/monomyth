import styled from 'styled-components';
import { DateTime } from 'luxon';
import Tooltip from './Tooltip';
import { useState } from 'react';

const DateButton = styled.button`
  color: white;
  border: none;
  background-color: transparent;
  cursor: pointer;
  text-align: right;
`

const DateTag = (props) => {

  // Handle tooltip display state
  const [showTooltip, setShowTooltip] = useState(false);

  const onDateClick = (e) => {
    e.preventDefault();
    setShowTooltip(!showTooltip);
  }
  
  // Takes ISO date string, returns <p> element describing
  // time elapsed from now (e.g. "two days ago")
  const datePosted = DateTime.fromISO(props.date);
  const durationString = datePosted.toRelative();
  const dateString = datePosted.toLocaleString(DateTime.DATETIME_SHORT);
  
  return (
    <DateButton onClick={onDateClick} >
      {durationString}
      {(showTooltip) ? <Tooltip tooltipString={dateString} /> : null }
    </DateButton>
  )
}

export default DateTag
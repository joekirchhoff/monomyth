import styled from 'styled-components';
import { DateTime } from 'luxon';
import Tooltip from './Tooltip';
import { useState } from 'react';

const DateButton = styled.button`
  color: #eee;
  border: none;
  background-color: transparent;
  cursor: pointer;
  text-align: right;
`

const DateTag = (props) => {

  // Handle tooltip display state
  const [showTooltip, setShowTooltip] = useState(false);

  // Clicking date tag (and tooltip box, if open) will toggle tooltip open / closed
  const onClick = (e) => {
    e.preventDefault();
    setShowTooltip(!showTooltip);
  }

  // Clicking anywhere outside tooltip box will close tooltip
  const onBlur = (e) => {
    e.preventDefault();
    setShowTooltip(false)
  }
  
  // Takes ISO date string, returns <p> element describing
  // time elapsed from now (e.g. "two days ago")
  const datePosted = DateTime.fromISO(props.date);
  const durationString = datePosted.toRelative();
  const dateString = datePosted.toLocaleString(DateTime.DATETIME_SHORT);
  
  return (
    <DateButton onClick={onClick} onBlur={onBlur} >
      {durationString}
      {(showTooltip) ? <Tooltip tooltipString={dateString} /> : null }
    </DateButton>
  )
}

export default DateTag
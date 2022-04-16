import styled from 'styled-components';
import { DateTime } from 'luxon';

const DateText = styled.p`
  color: white;
`

const DateTag = (props) => {
  
  // Takes ISO date string, returns <p> element describing
  // time elapsed from now (e.g. "two days ago")
  const datePosted = DateTime.fromISO(props.date);
  const durationString = datePosted.toRelative();
  
  return (
    <DateText>
      {durationString}
    </DateText>
  )
}

export default DateTag
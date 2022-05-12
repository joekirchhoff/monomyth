import styled from 'styled-components';
import { DateTime } from 'luxon';

// Version of DateTag component without interactive tooltip (used for StoryCard component)

const DateSpan = styled.span`
  color: ${props => props.theme.textMainColor};
  border: none;
  background-color: transparent;
  cursor: pointer;
  text-align: right;
`

const StoryCardDateTag = (props) => {
  
  // Takes ISO date string, returns element describing
  // time elapsed from now (e.g. "two days ago")
  const datePosted = DateTime.fromISO(props.date);
  const durationString = datePosted.toRelative();
  
  return (
    <DateSpan >
      {durationString}
    </DateSpan>
  )
}

export default StoryCardDateTag
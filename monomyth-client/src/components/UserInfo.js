import styled from 'styled-components';
import { Link } from 'react-router-dom';
import DateTag from './DateTag';

const Container = styled.section`
  background-color: #222;
  padding: 2rem;
  max-width: 750px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  box-shadow:
    .25rem .5rem 1rem rgba(0, 0, 0, 0.3),
    0 0 1.5rem rgba(0, 0, 0, .2);
`

const JoinedDate = styled.span`
  font-size: .8rem;
  text-align: right;
  margin-bottom: 1rem;
`

const UserHeader = styled.h1`
  font-size: 3rem;
  text-align: center;
  margin: 0.5rem 0 1rem 0;
`

const Subheader = styled.h2`
  font-size: 1.5rem;
  text-align: center;
  border-bottom: gray solid 1px;
`

const UserBio = styled.p`
  padding: 1rem 0;
  margin-bottom: 3rem;
  white-space: pre-line;
`

const LinkWarning = styled.p`
  font-style: italic;
  text-align: center;
  font-size: .8rem;
  padding: .5rem;
`

const LinkList = styled.ul`
  text-align: center;
  list-style-type: none;
  padding: 1rem;
`

const UserLink = styled.a`
  text-align: center;
  color: lightblue;
`

const MissingFieldMsg = styled.p`
  padding: 1rem 0;
`

const UpdateLink = styled(Link)`
  text-align: right;
  color: lightblue;
`

const UserInfo = (props) => {

  // Decode HTML entities in user bio; textarea only used for decoding
  const decoderTextarea = document.createElement('textarea');
  decoderTextarea.innerHTML = props.user.bio;
  const decodedBio = decoderTextarea.value;

  return (
    <Container >
      <UserHeader>{props.user.username}</UserHeader>
      <Subheader>Bio</Subheader>
      {(props.user.bio.length) ? 
        <UserBio>{decodedBio}</UserBio>
      : <MissingFieldMsg>User has no bio yet</MissingFieldMsg>
      }
      <Subheader>Personal Links</Subheader>
      <LinkWarning>Note: Please exercise caution with external links!</LinkWarning>
      {(props.user.links.length) ?
        <LinkList>
          {props.user.links.map(link => {
            return (
              <li key={link}>
                <UserLink href={link}>{link}</UserLink>
              </li>
            )
          })}
        </LinkList>
      : <MissingFieldMsg>User has no links yet</MissingFieldMsg>
      }
      <JoinedDate>
        Joined
        <DateTag date={props.user.date}/>
      </JoinedDate>
      {(props.currentUser && props.user._id === props.currentUser._id) ?
        <UpdateLink to={`/user/${props.user._id}/update`}>Edit profile</UpdateLink>
      : null
      }
    </Container>
  )
}

export default UserInfo
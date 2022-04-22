import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.section`
  background-color: #222;
  color: white;
  padding: 2rem;
  max-width: 750px;
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
`

const UserHeader = styled.h1`
  font-size: 2rem;
  text-align: center;
  margin: 1rem 0 2rem 0;
`

const Subheader = styled.h2`
  font-size: 1.5rem;
  text-align: center;
  border-bottom: gray solid 2px;
`

const UserBio = styled.p`
  padding: 1rem 0;
  margin-bottom: 3rem;
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
`

const MissingFieldMsg = styled.p`
  padding: 1rem 0;
`

const UpdateLink = styled(Link)`
  text-align: right;
`

const UserInfo = (props) => {

  return (
    <Container >
      <UserHeader>{props.user.username}</UserHeader>
      <Subheader>Bio</Subheader>
      {(props.user.bio.length) ? 
        <UserBio>{props.user.bio}</UserBio>
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
      {(props.currentUser && props.user._id === props.currentUser._id) ?
        <UpdateLink to={`/user/${props.user._id}/update`}>Edit profile</UpdateLink>
      : null
      }
    </Container>
  )
}

export default UserInfo
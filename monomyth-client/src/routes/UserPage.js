import { useParams } from 'react-router-dom'
import styled from 'styled-components';

const PageContainer = styled.div`
  flex: 1;
`

function UserPage() {

  const userID = useParams().userID;

  return (
    <PageContainer>
      This is the user page!
      User ID: {userID}
    </PageContainer>
  );
}

export default UserPage;

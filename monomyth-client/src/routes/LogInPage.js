import GuestLogIn from "../components/GuestLogIn";
import LogInForm from "../components/LogInForm";
import styled from 'styled-components';

const PageContainer = styled.div`
  flex: 1;
`

function LogInPage() {
  return (
    <PageContainer>
      <LogInForm />
      <GuestLogIn />
    </PageContainer>
  );
}

export default LogInPage;

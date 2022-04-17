import SignUpForm from "../components/SignUpForm";
import GuestLogIn from "../components/GuestLogIn";
import styled from 'styled-components';

const PageContainer = styled.div`
  flex: 1;
`

function SignUpPage() {
  return (
    <PageContainer>
      <SignUpForm />
      <GuestLogIn />
    </PageContainer>
  );
}

export default SignUpPage;

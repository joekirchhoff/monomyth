import SignUpForm from "../components/SignUpForm";
import GuestLogIn from "../components/GuestLogIn";
import styled from 'styled-components';
import { useEffect } from "react";

const PageContainer = styled.div`
  flex: 1;
`

function SignUpPage() {

  // Scroll to top of page on render
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <PageContainer>
      <SignUpForm />
      <GuestLogIn />
    </PageContainer>
  );
}

export default SignUpPage;

import GuestLogIn from "../components/GuestLogIn";
import LogInForm from "../components/LogInForm";
import styled from 'styled-components';
import { useEffect } from "react";

const PageContainer = styled.div`
  flex: 1;
`

function LogInPage() {

  // Scroll to top of page on render
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <PageContainer>
      <LogInForm />
      <GuestLogIn />
    </PageContainer>
  );
}

export default LogInPage;

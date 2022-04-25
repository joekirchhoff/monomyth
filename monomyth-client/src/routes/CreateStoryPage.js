import CreateStoryForm from "../components/CreateStoryForm";
import styled from 'styled-components';
import { useEffect } from "react";

const PageContainer = styled.div`
  flex: 1;
`

function CreateStoryPage() {

  // Scroll to top of page on render
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <PageContainer>
      <CreateStoryForm />
    </PageContainer>
  );
}

export default CreateStoryPage;

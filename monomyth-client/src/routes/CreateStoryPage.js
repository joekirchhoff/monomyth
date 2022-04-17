import CreateStoryForm from "../components/CreateStoryForm";
import styled from 'styled-components';

const PageContainer = styled.div`
  flex: 1;
`

function CreateStoryPage() {
  return (
    <PageContainer>
      <CreateStoryForm />
    </PageContainer>
  );
}

export default CreateStoryPage;

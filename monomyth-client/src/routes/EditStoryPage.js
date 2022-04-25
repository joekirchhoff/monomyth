import styled from 'styled-components';
import EditStoryForm from "../components/EditStoryForm";

const PageContainer = styled.div`
  flex: 1;
`

function EditStoryPage() {
  
  return (
    <PageContainer>
      <EditStoryForm />
    </PageContainer>
  );
}

export default EditStoryPage;

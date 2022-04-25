import styled from 'styled-components';
import { useState, useEffect } from 'react';
import DeleteStoryForm from '../components/DeleteStoryForm';
import EditStoryForm from "../components/EditStoryForm";
import DeleteStoryReceipt from '../components/DeleteStoryReceipt';

const PageContainer = styled.div`
  flex: 1;
`

function EditStoryPage(props) {

  // Scroll to top of page on render
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // After successful story delete, shows receipt dialogue and blurs forms in background 
  const [showDeleteReceipt, setShowDeleteReceipt] = useState(false)
  const [showBlur, setShowBlur] = useState(false);
  
  return (
    <PageContainer>
      {(showDeleteReceipt) ? <DeleteStoryReceipt /> : null}
      <EditStoryForm showBlur={showBlur} />
      <DeleteStoryForm
        currentUser={props.currentUser}
        setShowDeleteReceipt={setShowDeleteReceipt}
        showBlur={showBlur}
        setShowBlur={setShowBlur}
      />
    </PageContainer>
  );
}

export default EditStoryPage;

import { useParams } from 'react-router-dom'

function StoryPage() {

  const storyID = useParams().storyID;

  return (
    <div>
      This is the story page!
      Story ID: {storyID}
    </div>
  );
}

export default StoryPage;

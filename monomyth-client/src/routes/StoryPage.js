import { useParams } from 'react-router-dom'
import Story from '../components/Story';

function StoryPage() {

  const storyID = useParams().storyID;

  return (
    <div>
      <Story storyID={storyID}/>
    </div>
  );
}

export default StoryPage;

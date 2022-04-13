import { useParams } from 'react-router-dom'
import Story from '../components/Story';

function StoryPage(props) {

  const storyID = useParams().storyID;

  return (
    <div>
      <Story storyID={storyID} currentUser={props.currentUser} />
    </div>
  );
}

export default StoryPage;
